const express = require('express');
const router = express.Router();

// elections model
const Election = require('../models/election');

// new election form
router.get('/add', function(req, res){
  res.render('add_election', {
    _electionName: 'Add election Name'
  });
});

// submit new election
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('_electionName', 'election name is required').notEmpty();
  req.checkBody(' _electionDate', 'The type of election is required').notEmpty();
  req.checkBody('_constituencies', 'constituencies  is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_election', {
      title: 'Add Election',
      errors: errors
    });
  } else {
    let election = new Election();
    election._electionName = req.body._electionName;
    election._electionDate = req.body._electionDate;
    election._constituencies = req.body._constituencies;

    election.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Election Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Election.findById(req.params.id, function(err, election){
    res.render('edit_election', {
      _electionName: 'Edit election',
      election: election
    });
  });
});

// update submit new election
router.post('/edit/:id', function(req, res){
  let election = {};
  election._electionName = req.body._electionName;
  election._electionDate = req.body._electionDate;
  election._constituencies = req.body._constituencies;

  let query = {_id: req.params.id};

  Election.update(query, election, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Election Updated');
      res.redirect('/');
    }
  })
});

// update submit new Election
router.post('/checkOut/:id', function(req, res){
  let election = {};
  election._electionName = req.body._electionName;
  election._electionDate = req.body._electionDate;
  election._constituencies = req.body._constituencies;
  console.log(election);

  let query = {_id: req.params.id};

  Election.update(query, election, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Election Updated');
      res.redirect('/');
    }
  })
});

//NEED A DELETE POST

// get single Election
router.get('/:id', function(req, res){
  Election.findById(req.params.id, function(err, election){
    res.render('election', {
      election: election
    });
  });
});

module.exports = router;
