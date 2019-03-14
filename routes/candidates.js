const express = require('express');
const router = express.Router();

// candidates model
const Candidate = require('../models/candidate');

// new candidate form
router.get('/add', function(req, res){
  res.render('add_candidate', {
    title: 'Add candidate'
  });
});

// submit new candidate
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('firstName', 'first name is required').notEmpty();
  req.checkBody('surname', 'surname is required').notEmpty();
  req.checkBody('party', 'Party is required').notEmpty();


  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_candidate', {
      title: 'Add Candidate',
      errors: errors
    });
  } else {
    let candidate = new Candidate();
    candidate._firstName = req.body._firstName;
    candidate._surname = req.body._surname;
    candidate._party = req.body.__party;

    candidate.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'candidate Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Candidate.findById(req.params.id, function(err, candidate){
    res.render('edit_candidate', {
      _name: 'Edit Candidate',
      candidate: candidate
    });
  });
});

// update submit new candidate
router.post('/edit/:id', function(req, res){
  let candidate = {};
  candidate._firstName = req.body._firstName;
  candidate._surname = req.body._surname;
  candidate._party = req.body.__party;

  let query = {_id: req.params.id};

  Candidate.update(query, candidate, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Candidate Updated');
      res.redirect('/');
    }
  })
});

//NEED A DELETE POST

module.exports = router;
