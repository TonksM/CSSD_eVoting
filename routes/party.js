const express = require('express');
const router = express.Router();

// partys model
const Party = require('../models/party');

// new party form
router.get('/add', function(req, res){
  res.render('add_party', {
    _partyName: 'Add party Name'
  });
});

// submit new party
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();
  req.checkBody(' partyColour', 'The Parties colour is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('addParty', {
      errors: errors
    });
  } else {
    let party = new Party();
    party._name = req.body.partyName;
    party._partyColour = req.body.partyColour;

    party.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Party Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit', function(req, res){
  res.render('editParty', {
  });
});

// update submit new party
router.post('/edit/:id', function(req, res){
  let party = {};
  party._name = req.body.partyName;
  party._partyColour = req.body.partyColour;

  let query = {_id: req.params.id};

  Party.update(query, party, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Party Updated');
      res.redirect('/');
    }
  })
});



// get single Party
router.get('/:id', function(req, res){
  Party.findById(req.params.id, function(err, party){
    res.render('party', {
      party: party
    });
  });
});

module.exports = router;
