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


router.get('/', ensureNotAllVoted, function(req, res, next){
  let voterId = req.user;
  Voter.findOne({_id: voterId}).populate({path: '_address _proxyFor', populate:{ path: '_address'}}).exec(function (err, voter){
    var data = {
      voter: voter,
      proxees: voter._proxyFor
    }
    res.render('proxy', data)
  });
});

router.post('/ballot', function(req, res, next){
  let voterId = req.body.voterId;
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    let vpc = voter._address._postcode;
    console.log("Postcode:"+vpc);

    Constituency.findOne({_validPostcodes: vpc}).populate({
      path: '_candidates', populate:{path : '_address _party'}
    }).exec(function(err, constituency){
      console.log(constituency._candidates);
        var data = {
          candidates : constituency._candidates
        }
        res.render('ballot', data)
      
    });
  });
});

router.post('/ballot/cast_vote', ensureAuthticated, function(req, res, next){
  let voterId = req.user;
  let noo = new Vote({
      _vote: req.body.vote
  });
  noo.save(function(err, nu){
    if(err) return console.error(err);
    Voter.findOneAndUpdate({_id: voterId}, { _hasVoted: true}, function(err){
      if(err) return console.error(err);
    });
  }); 
});


router.get('/vote_confirmed', function(req, res, next){
  res.render('vote_cast');
});

router.get("/vote_msg", function(req, res, next){
  var data = {
    msg: ""
  } 
  
  switch(req.query.msg){
        case 'confirm':
          data.msg = "Thank you for votingx! :3";
          break;
        case 'error':
          data.msg = "There was an error! :O";
          break;
        case 'voted':
          data.msg = "You have already voted, please logout."
        break;
  }

  res.render('vote_msg', data);
});

module.exports = router;


