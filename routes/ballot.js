var express = require('express');
var router = express.Router();
var passport = require('passport')
var Constituency = require('../models/constituency');
var Candidate = require('../models/candidate');
var Voter = require('../models/voter');
var Vote = require('../models/vote');
const session = require('express-session');
const {ensureAuthticated} = require("../config/auth");
const {ensureNotVoted} = require("../config/voted")
const {isNotProxy} = require("../config/proxy");


/* GET users listing. */
router.get('/', ensureAuthticated, isNotProxy, ensureNotVoted, function(req, res, next) {
  //code to access database and get ballot
  let voterId = req.user;
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    let vpc = voter._address._postcode;
    console.log("Postcode:"+vpc);

    Constituency.findOne({_validPostcodes: vpc}).populate({
      path: '_candidates', populate:{path : '_address _party'}
    }).exec(function(err, constituency){
      console.log(constituency._candidates);
        var data = {
          voter:     voterId,
          candidates: constituency._candidates
        }
        res.render('ballot', data)
      
    });
  });
});

/*router.get('/proxy', function(req, res, next){
  let voterId = req.user;
  Voter.findOne({_id: voterId}).populate('_proxyFor').exec(function (err, voter){
    var data = {
      voter: voter,
      proxees: voter._proxyFor
    }
    res.render('proxy', data)
  });
});*/

router.get('/proxy/vote', function(req, res, next){

});

router.post('/cast_vote', ensureAuthticated, function(req, res, next){
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

router.get("/vote_msg", ensureAuthticated, function(req, res, next){
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


