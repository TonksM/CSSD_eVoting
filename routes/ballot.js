var express = require('express');
var router = express.Router();
var passport = require('passport')
let tempBallot = {_id:'tempID', 
                  candidates:[{_id:'idTonks',_surname:"Ions",_firstName:'Tonks',_party:'Party3'},
                              {_id:'idBen',_surname:"Hadlow",_firstName:'Ben',_party:'Party2'},,
                              {_id:'idHatsings',_surname:"Hasting",_firstName:'Ben',_party:'Party1'},]};
var Constituency = require('../models/constituency');
var Candidate = require('../models/candidate');
var Voter = require('../models/voter');
const session = require('express-session');
//const {ensureAuthticated} = require("../config/auth");


/* GET users listing. */
router.get('/', /*ensureAuthticated ,*/function(req, res, next) {
  //code to access database and get ballot
  let voterId = req.user;
  Voter.findOne({_id: voterId}).populate('_address').exec( function (err, voter){
    let vpc = voter._address._postcode;
    Constituency.findOne({_validPostcodes: vpc}).populate('_candidates').exec(function(err, constituency){
      Candidate.find({_constituency:constituency._id}, function(err,standees){
        var data = {
          candidates : standees
        }
        res.render('ballot', data)
      });
      
    });
  });
  //res.render('ballot', tempBallot);
});

router.post('/cast_vote', /*ensureAuthticated ,*/function(req, res, next){

});
module.exports = router;
