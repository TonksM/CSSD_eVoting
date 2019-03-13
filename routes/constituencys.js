const express = require('express');
const router = express.Router();

// constituencys model
const Constituency = require('../models/constituency');

// new constituency form
router.get('/add', function(req, res){
  res.render('add_constituency', {
    title: 'Add constituency'
  });
});

// submit new constituency
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('candidates', 'candidates is required').notEmpty();
  req.checkBody('validPostcodes', 'postcode is required').notEmpty();


  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_constituency', {
      title: 'Add Constituency',
      errors: errors
    });
  } else {
    let constituency = new Constituency();
    constituency._name = req.body._name;
    constituency._candidates = req.body._candidates;
    constituency._validPostcodes = req.body._validPostcodes;

    constituency.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Constituency Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Constituency.findById(req.params.id, function(err, constituency){
    res.render('edit_constituency', {
      _name: 'Edit Constituency',
      constituency: constituency
    });
  });
});

// update submit new constituency
router.post('/edit/:id', function(req, res){
  let constituency = {};
  constituency._name = req.body._name;
  constituency._candidates = req.body._candidates;
  constituency._validPostcodes = req.body._validPostcodes;

  let query = {_id: req.params.id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Constituency Updated');
      res.redirect('/');
    }
  })
});

// update submit new Constituency
router.post('/checkOut/:id', function(req, res){
  let constituency = {};
  constituency._name = req.body._name;
  constituency._candidates = req.body._candidates;
  constituency._validPostcodes = req.body._validPostcodes;
  console.log(constituency);

  let query = {_id: req.params.id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Constituency Updated');
      res.redirect('/');
    }
  })
});

//NEED A DELETE POST

// get single Constituency
router.get('/:id', function(req, res){
  Constituency.findById(req.params.id, function(err, constituency){
    res.render('constituency', {
      constituency: constituency
    });
  });
});

module.exports = router;
