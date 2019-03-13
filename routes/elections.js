const express = require('express');
const router = express.Router();

// elections model
const Election = require('../models/election');

// new election form
router.get('/add', function(req, res){
  res.render('add_election', {
    title: 'Add election'
  });
});

// submit new election
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('electiontype', 'The type of election is required').notEmpty();
  req.checkBody('electioninfo', 'Election info is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_election', {
      title: 'Add Election',
      errors: errors
    });
  } else {
    let election = new Election();
    election.title = req.body.title;
    election.electiontype = req.body.electiontype;
    election.electioninfo = req.body.electioninfo;

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
      title: 'Edit Constituency',
      constituency: constituency
    });
  });
});

// update submit new constituency
router.post('/edit/:id', function(req, res){
  let constituency = {};
  constituency.title = req.body.title;
  constituency.author = req.body.author;
  constituency.body = req.body.body;

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
  constituency.title = req.body.title;
  constituency.author = req.body.author;
  constituency.body = req.body.body;
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
