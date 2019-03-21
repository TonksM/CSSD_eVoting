/** @module routes/ballot Routes */

var express = require('express');
var router = express.Router();
var passport = require('passport')
var Constituency = require('../models/constituency');
var Candidate = require('../models/candidate');
var Voter = require('../models/voter');
var Vote = require('../models/vote');
const session = require('express-session');
const {ensureAuthticated} = require("../config/auth"); 
const {ensureNotVoted} = require("../config/voted"); 
const {isNotAWP} = require("../config/proxy");
const {isNotProxy} = require("../config/proxy"); 

/**
 * This route gets the current user's id, and queries the user collection with it. The .populate 
    command uses the reference within the Voter schema to populate the address fields. The Postcode 
    is used to retrieve the appropriate constitiuency and then populates the candidates that are 
    associated with that constituency. The voterId, the constituency, candidates are then placed 
    into an array called 'data' to populate the ejs template variables on the ejs template.
 * @name Ballot view ballot route
 * @param RequestType GET
 * @param Request The request being sent to the route
 * @param Response The response being sent from the route
 * @param Next The callback function
 * @param voterId The current voter/user's ObjectId
 * @param data The data to be sent to the response (ejs template)
 * @param ensureAuthenticated Verifies the voter
 * @param ensureNotVoted Verifies that the voter has not voted
 * @param isNotAWP AWP stands for "associated with proxt", and this checks if the voter has another account voting on their account, redirecting a message explaining this. 
 * @param isNotProxy Checks if the voter is a proxy for any other accounts, and redirects them to the proxy voter select screen
 * @callback 'ballot/'
 **/

router.get('/', ensureAuthticated, isNotAWP, isNotProxy, ensureNotVoted, function(req, res, next) {
  //
  let voterId = req.user;                                                                  
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    //
    let vpc = voter._address._postcode;
    Constituency.findOne({_validPostcodes: vpc}).populate({
      path: '_candidates', populate:{path : '_address _party'}
    }).exec(function(err, constituency){
      //
      var data = {
        constituency:  constituency,
        voter:          voterId,
        candidates:     constituency._candidates
      }
      res.render('ballot', data)
      
    });
  });
});

/**
 * Mongoose creates a new Vote object, based on the Vote Schema, then saves to the appropriate collection.
    The voter's _voted flag is set to true, and then if successful in both the save and the update
    to the database, the user is presented with a confirmation screen with only the option to log out.
    If either databse action is unsuccessful, the user will be presented with a simple error message.
 * @name Ballot cast_vote route
 * @param RequestType POST
 * @param Request The request being sent to the route
 * @param Response The response being sent from the route
 * @param Next The callback function
 * @param voterId The current voter/user's ObjectId 
 * @param noo The new Vote object
 * @param _voted The flag that tells the system that the voter has voted
 * @param ensureAuthenticated Verifies the voter
 * @callback 'ballot/cast_vote'
 */

router.post('/cast_vote', ensureAuthticated, function(req, res, next){
  let voterId = req.user;
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

/**
 * Determines to correct message to display based on the GET message query
 * @name Ballot Vote Message route
 * @param RequestType GET
 * @param Request The request being sent to the route
 * @param Response The response being sent from the route
 * @param Next The callback function
 * @param data The data to be sent to the response (ejs template)
 * @param ensureAuthenticated Verifies the voter
 * @callback 'ballot/vote_msg'
 */

router.get("/vote_msg", ensureAuthticated, function(req, res, next){
  var data = {
    msg: ""
  } 
  
  switch(req.query.msg){
        case 'confirm':
          data.msg = "Thank you for voting!";
            res.render('vote_msg', data);
          break;
        case 'error':
          data.msg = "There was an error!";
            res.render('vote_msg', data);
          break;
        case 'voted':
          data.msg = "You have already voted, please logout!";
            res.render('vote_msg', data);
          break;
        case 'prox':
          var vid = req.user;
          var query = getProxy(vid);
          function getProxy(id){
            var query = Voter.findOne({_proxyFor:id});
            return query;
          }
          query.exec(function(err, proxy){
            if(err) return console.error(err);
            var pName = proxy._firstName +" "+ proxy._surname;
            data.msg = pName + " is voting on your behalf";
            console.log("query:" + data.msg);
            res.render('vote_msg', data);
          });
          console.log("case:" + data.msg);
          break;
  }
});


module.exports = router;


