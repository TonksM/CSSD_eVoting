var express = require('express');
var router = express.Router();
var passport = require('passport')
var Constituency = require('../models/constituency');
var Candidate = require('../models/candidate');
var Voter = require('../models/voter');
var Vote = require('../models/vote');
const session = require('express-session');
const {ensureAuthticated} = require("../config/auth");
const {ensureNotAllVoted} = require("../config/voted")


router.get('/', ensureAuthticated, ensureNotAllVoted, function(req, res, next){
  //This router uses the voter's id to query their index within the user collection
  //retrieving any associated proxy accounts, and populating their fields by
  //referencing the Voter schema. For easy distinguisability between the proxy,
  //and thier associated accounts, their addresses are also populated.
  let voterId = req.user;
  Voter.findOne({_id: voterId}).populate({
      path: '_address _proxyFor', 
      populate:{ path: '_address'}
    }).exec(function (err, voter){
    //The Voter and the proxy are both stored within the data that is sent to the ejs template
    var data = {
      voter:          voter,
      proxees:        voter._proxyFor
    }
    res.render('proxy', data)
  });
});

router.post('/ballot', ensureAuthticated, function(req, res, next){
  //The route functions similar to its counterpart in the ballot router, however,
  //has a couple major differences:
  //  - The router is POSTed due to the sending the selected user id from the '/' GET route
  //  - The voterId is determined by a hidden field on the rendered ejs template for '/'
  //    GET route
  //Other than that, please refer to the documentation for the Ballot.js router
  let voterId = req.body.selectedUser;
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    let vpc = voter._address._postcode;
    console.log("Postcode:"+vpc);

    Constituency.findOne({_validPostcodes: vpc}).populate({
      path: '_candidates', populate:{path : '_address _party'}
    }).exec(function(err, constituency){
      console.log(constituency._candidates);
        var data = {
          constitiuency:  constituency,
          voter:          voterId, 
          candidates:     constituency._candidates
        };
        res.status(200);
        res.render('ballot', data);
      
    });
  });
});

router.post('/ballot/cast_vote', ensureAuthticated, function(req, res, next){
  //Similarly to the Proxy version of Ballot, the VoterId is determined by a 
  //hidden field within the previous ejs template that is POSTed upon
  //submission of the vote. Other than that difference, please refer to
  //the documentation on the Ballot.js router file
  let voterId = req.body.voterId;
  let noo = new Vote({
      _vote: req.body.votingFor
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

router.get('/ballot/vote_msg', ensureAuthticated, function(req, res, next){
  //This route is almost identical to its non-proxy counterpart, however, has a
  //slightly different message for when the proxy has voted for all associated
  //including their own.
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
          data.msg = "All assoicated voters for this account have voted, please log out";
          break;
  }
  res.render('vote_msg', data);
});

module.exports = router;


