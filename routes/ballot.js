var express = require('express');
var router = express.Router();
var passport = require('passport')
var Constituency = require('../models/constituency');
var Candidate = require('../models/candidate');
var Voter = require('../models/voter');
var Vote = require('../models/vote');
const session = require('express-session');
const {ensureAuthticated} = require("../config/auth"); //Verifies the voter
const {ensureNotVoted} = require("../config/voted"); //Verifies that the voter has not voted
const {isNotProxy} = require("../config/proxy"); 
//Checks if the voter is a proxy for any other accounts, and redirects them to the proxy voter select screen


router.get('/', ensureAuthticated, isNotProxy, ensureNotVoted, function(req, res, next) {
  //This router gets the current user's id, and queries the user collection with it. The .populate 
  //command uses the reference within the Voter schema to populate the address fields.
  let voterId = req.user;                                                                  
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    //The Postcode is used to retrieve the appropriate constitiuency and then populates the candidates
    //that are associated with that constituency.
    let vpc = voter._address._postcode;
    Constituency.findOne({_validPostcodes: vpc}).populate({
      path: '_candidates', populate:{path : '_address _party'}
    }).exec(function(err, constituency){
      //The voterId, the constituency, candidates are then placed into an array to populate our variables
      //on the ejs template
      var data = {
        constitiuency:  constituency,
        voter:          voterId,
        candidates:     constituency._candidates
      }
      res.render('ballot', data)
      
    });
  });
});

router.post('/cast_vote', ensureAuthticated, function(req, res, next){
  let voterId = req.user;
  let noo = new Vote({
      _vote: req.body.vote
  });
  noo.save(function(err, nu){
    if(err) return function(){
      console.error(err);
      res.redirect('./vote_msg/?msg=error' )
    };
    Voter.findOneAndUpdate({_id: voterId}, { _hasVoted: true}, function(err){
        if(err) return function(){
        console.error(err);
        res.redirect('./vote_msg/?msg=error' )
      };
      res.redirect('./vote_msg/?msg=confirm')
    });
  }); 
});

router.get("/vote_msg", ensureAuthticated, function(req, res, next){
  var data = {
    msg: ""
  } 
  
  switch(req.query.msg){
        case 'confirm':
          data.msg = "Thank you for voting!";
          break;
        case 'error':
          data.msg = "There was an error!";
          break;
        case 'voted':
          data.msg = "You have already voted, please logout!"
        break;
  }

  res.render('vote_msg', data);
});

module.exports = router;


