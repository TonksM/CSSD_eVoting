var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const {ensureAuthticated} = require("../config/auth");
const {isAdmin} = require("../config/isAdmin");
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const Candidate = require('../models/candidate');
const Ballot = require('../models/ballot');
const Party = require('../models/party');
const Address = require('../models/address');
const Voter = require('../models/voter');

/* GET admin view. */
router.get('/', ensureAuthticated, isAdmin, function(req, res, next) {
	res.render('admin');
});

/* START of PARTY ROUTES*/
/* GET PARTY listing. */
router.get('/party', ensureAuthticated, isAdmin, function(req, res, next) {
  Party.find({_deleted:false}).then(parties =>{
    console.log(parties);
    res.render('editParty',{parties:parties,err: req.flash('errors')});
    console.log(req.flash('errors'))  
  });
});

/* GET PARTY add view. */
router.get('/party/add', ensureAuthticated, isAdmin, function(req, res, next) {
	res.render('addParty', {err: req.flash('errors')});
});

// submit new party
router.post('/party/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();
  req.checkBody('partyColour', 'Party colour is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/party/add');
    });
  } else {
    let party = new Party();
    party._name = req.body.partyName;
    party._partyColour = req.body.partyColour;
    party._deleted = false;

    party.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new party
router.post('/party/edit', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();
  req.checkBody('partyColour', 'Party colour is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    res.redirect('/admin/party');
  } else {
    let party = {};
    party._id = req.body.partyId;
    party._name = req.body.partyName;
    party._partyColour = req.body.partyColour;
    party._deleted = false;

    console.log('Party:' + party);
    let query = {_id: party._id};

    Party.update(query, party, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/party');
      }
    });
  }
});

// remove party
router.post('/party/remove', ensureAuthticated, isAdmin, function(req, res){
  let party = {};
  party._id = req.body.partyId;
  party._name = req.body.partyName;
  party._partyColour = req.body.partyColour;
  party._deleted = true;

  console.log('Party:' + party);
  let query = {_id: party._id};

  Party.update(query, party, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/party');
    }
  })
});
/* END of PARTY ROUTES*/

/* START of ADDRESS ROUTES*/
/* GET ADDRESS listing. */
router.get('/address', ensureAuthticated, isAdmin, function(req, res, next) {
	Address.find({_deleted:false}).then(addresses =>{
    console.log(addresses);
    res.render('editAddress',{addresses:addresses,err: req.flash('errors')});
  });
});

/* GET ADDRESS add view. */
router.get('/address/add', ensureAuthticated, isAdmin, function(req, res, next) {
	res.render('addAddress',{err: req.flash('errors')});
});

// submit new candidate
router.post('/address/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();
  req.checkBody('city', 'City Name is required').notEmpty();
  req.checkBody('county', 'County is required').notEmpty();
  req.checkBody('postcode', 'Postcode is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/address/add');
    });
  } else {
    let address = new Address();
    address._addressLine1 = req.body.addressLine1;
    address._addressLine2 = req.body.addressLine2;
    address._addressLine3 = req.body.addressLine3;
    address._city = req.body.city;
    address._county = req.body.county;
    address._postcode = req.body.postcode;
    address._deleted = false;

    address.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new party
router.post('/address/edit', ensureAuthticated, isAdmin, function(req, res){

  req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();
  req.checkBody('city', 'City Name is required').notEmpty();
  req.checkBody('county', 'County is required').notEmpty();
  req.checkBody('postcode', 'Postcode is required').notEmpty();
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/address');
    });
  } else {
    let address = {};
    address._id = req.body.addressId;
    address._addressLine1 = req.body.addressLine1;
    address._addressLine2 = req.body.addressLine2;
    address._addressLine3 = req.body.addressLine3;
    address._city = req.body.city;
    address._county = req.body.county;
    address._postcode = req.body.postcode;
    address._deleted = false;

    console.log('Address:' + address);
    let query = {_id: address._id};

    Address.update(query, address, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/address');
      }
    });
  }
});

// remove party
router.post('/address/remove', ensureAuthticated, isAdmin, function(req, res){
  let address = {};
  address._id = req.body.addressId;
  address._addressLine1 = req.body.addressLine1;
  address._addressLine2 = req.body.addressLine2;
  address._addressLine3 = req.body.addressLine3;
  address._city = req.body.city;
  address._county = req.body.county;
  address._postcode = req.body.postcode;
  address._deleted = true;

  console.log('Address:' + address);
  let query = {_id: address._id};

  Address.update(query, address, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/address');
    }
  })
});
/* END of ADDRESS ROUTES*/

/* START of CANDIDATE ROUTES*/
/* GET CANDIDATE listing. */
router.get('/candidate', ensureAuthticated, isAdmin, function(req, res, next) {
	Candidate.find({_deleted:false}).then(candidates =>{
    console.log(candidates);
    Party.find({_deleted:false}).then(parties=>{
      Address.find({_deleted:false}).then(addresses=>{
        res.render('editCandidate',{candidates:candidates,parties:parties,addresses:addresses,err: req.flash('errors')});
      });  
    });
  });
});

/* GET CANDIDATE add view. */
router.get('/candidate/add', ensureAuthticated, isAdmin, function(req, res, next) {
	Party.find({_deleted:false}).then(parties=>{
    Address.find({_deleted:false}).then(addresses=>{
      res.render('addCandidate',{parties:parties,addresses:addresses,err: req.flash('errors')});
    });
  });
});

// submit new candidate
router.post('/candidate/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('party', 'Party is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/candidate/add');
    });
  } else {
    let candidate = new Candidate();
    candidate._firstName = req.body.firstName;
    candidate._surname = req.body.surname;
    candidate._party = req.body.party;
    candidate._address = req.body.address;
    candidate._deleted = false;

    console.log("candidate: " + candidate);

    Candidate.create(candidate,function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new candidate
router.post('/candidate/edit', ensureAuthticated, isAdmin, function(req, res){
  
  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('party', 'Party is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/candidate');
    });
  } else {
    let candidate = new Candidate();
    candidate._id = req.body.candidateId;
    candidate._firstName = req.body.firstName;
    candidate._surname = req.body.surname;
    candidate._party = req.body.party;
    candidate._address = req.body.address;
    candidate._deleted = false;

    let query = {_id: candidate._id};

    Candidate.update(query, candidate, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/candidate');
      }
    });
  }
});

//remove candidate
router.post('/candidate/remove/', ensureAuthticated, isAdmin, function(req, res){
  let candidate = new Candidate();
  candidate._id = req.body.candidateId;
  candidate._firstName = req.body.firstName;
  candidate._surname = req.body.surname;
  candidate._party = req.body.party;
  candidate._deleted = true;

  let query = {_id: candidate._id};

  Candidate.update(query, candidate, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/candidate');
    }
  })
});
/* END of CANDIDATE ROUTES*/

/* START of CONSTITUENCEY ROUTES*/
/* GET CONSTITUENCEY listing. */
router.get('/constituency', ensureAuthticated, isAdmin, function(req, res, next) {
	Constituency.find({_deleted:false}).then(constituencies =>{
    Candidate.find({_deleted:false}).then(candidates =>{
      res.render('editConstituency',{err: req.flash('errors'),candidates:candidates,constituencies:constituencies});
    });
  });
});

/* GET CONSTITUENCEY add view. */
router.get('/constituency/add', ensureAuthticated, isAdmin, function(req, res, next) {
  Candidate.find({_deleted:false}).then(candidates =>{
	 res.render('addConstituency',{err: req.flash('errors'), candidates:candidates});
  });
});

// submit new constituency
router.post('/constituency/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('candidates', 'Candidates are required').notEmpty();
  req.checkBody('postcodes', 'Postcodes are required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/constituency/add');
    });
  } else {
    let constituency = new Constituency();
    constituency._name = req.body.name;
    constituency._candidates = req.body.candidates;
    constituency._validPostcodes = req.body.postcodes;
    constituency._deleted = false;

    constituency.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new constituency
router.post('/constituency/edit', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('candidates', 'Candidates are required').notEmpty();
  req.checkBody('postcodes', 'Postcodes are required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/constituency');
    });
  } else {
    let constituency = {};
    constituency._id = req.body.constituencyId;
    constituency._name = req.body.name;
    constituency._candidates = req.body.candidates;
    constituency._validPostcodes = req.body.postcodes;
    constituency._deleted = false;

    let query = {_id: constituency._id};

    Constituency.update(query, constituency, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/constituency');
      }
    });
  }
});

//remove constituency
router.post('/constituency/remove', ensureAuthticated, isAdmin, function(req, res){
  let constituency = {};
  constituency._id = req.body.constituencyId;
  constituency._name = req.body._name;
  constituency._candidates = req.body._candidates;
  constituency._validPostcodes = req.body._validPostcodes;
  constituency._deleted = true;

  let query = {_id:constituency._id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/constituency');
    }
  })
});
/* END of CONSTITUENCEY ROUTES*/

/* START of ELECTION ROUTES*/
/* GET ELECTION listing. */
router.get('/election', ensureAuthticated, isAdmin, function(req, res, next) {
  Election.find({_deleted:false}).then(elections =>{
    Constituency.find({_deleted:false}).then(constituencies=>{
      res.render('editElection',{err: req.flash('errors'), constituencies:constituencies,elections:elections});
    });
  });
});

/* GET ELECTION add view. */
router.get('/election/add', ensureAuthticated, isAdmin, function(req, res, next) {
	Constituency.find({_deleted:false}).then(constituencies=>{
    res.render('addElection',{err: req.flash('errors'), constituencies:constituencies});
  });
});

/* POST ELECTION */
router.post('/election/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('name', 'Election name is required').notEmpty();
  req.checkBody('startDate', 'The start date of the election is required').notEmpty();
  req.checkBody('endDate', 'The end date of the election is required').notEmpty();
  req.checkBody('constituencies', 'Constituencies are required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/election/add');
    });
  } else {
    let election = new Election();
    election._electionName = req.body.name;
    election._electionStart = req.body.startDate;
    election._electionEnd = req.body.endDate;
    election._constituencies = req.body.constituencies;
    election._deleted = false;

    console.log("Election: "+election);

    election.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new election
router.post('/election/edit', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('name', 'Election name is required').notEmpty();
  req.checkBody('startDate', 'The start date of the election is required').notEmpty();
  req.checkBody('endDate', 'The end date of the election is required').notEmpty();
  req.checkBody('constituencies', 'Constituencies are required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/election');
    });
  } else {
    let election = {};
    election._id = req.body.electionId;
    election._electionName = req.body.name;
    election._electionStart = req.body.startDate;
    election._electionEnd = req.body.endDate;
    election._constituencies = req.body.constituencies;
    election._deleted = false;

    let query = {_id: election._id};

    Election.update(query, election, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/election');
      }
    });
  }
});

//remove election
router.post('/election/remove', ensureAuthticated, isAdmin, function(req, res){
  let election = {};
  election._id = req.body.electionId;
  election._electionName = req.body.name;
  election._electionStart = req.body.startDate;
  election._electionEnd = req.body.endDate;
  election._constituencies = req.body.constituencies;
  election._deleted = true;

  let query = {_id: election._id};

  Election.update(query, election, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/election');
    }
  })
});
/* END of ELECTION ROUTES*/

/* START of RESULTS ROUTES*/
/* GET RESULTS listing. */
router.get('/results', ensureAuthticated, isAdmin, function(req, res, next) {
  var electionsChartData = [];
  function displayResults(electionsChartData){
    res.render('results',{err: req.flash('errors'), electionsChartData:electionsChartData});
  } 
  var itemsProcessed = 0;
  Election.find({_deleted:false}).populate({path:'_constituencies', populate:{path:'_candidates', populate:{path:'_party'}}}).exec((err,elections) =>{
    if(elections){
      elections.forEach(election=>{
        console.log("Election: ");
        console.log(election);
        election.tallyElection(function(chartData){
          chartData.electionName = election._electionName;
          chartData.id = election._id;
          itemsProcessed++;
          electionsChartData.push(chartData);
          if(itemsProcessed === elections.length) {
            displayResults(electionsChartData);
          }
        });

      });
    }
    
  });
});

/* START of VOTER ROUTES*/
/* GET VOTER listing. */
router.get('/voter', ensureAuthticated, isAdmin, function(req, res, next) {
  Voter.find().then(voters =>{
    console.log(voters);
     Address.find({_deleted:false}).then(addresses=>{
      res.render('editVoter',{err: req.flash('errors'), addresses:addresses,voters:voters});
    });
  });
});

/* GET VOTER add view. */
router.get('/voter/add', ensureAuthticated, isAdmin, function(req, res, next) {
  Voter.find().then(voters =>{
     Address.find({_deleted:false}).then(addresses=>{
      res.render('addVoter',{err: req.flash('errors'), addresses:addresses,voters:voters});
    });
  });
});

/* POST VOTER */
router.post('/voter/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();
  var proxies = req.body.proxyFor.length;
  if(proxies != null && proxies > 2){
    errors = ({"msg":"Only select two prxoies"});
  }

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/voter/add');
    });
  } else {
    let voter = new Voter();
    voter._id = req.body.candidateId;
    voter._firstName = req.body.firstName;
    voter._surname = req.body.surname;
    voter._address = req.body.address;
    voter._proxyFor = req.body.proxyFor;


    console.log("Voter: "+voter);

    voter.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin');
      }
    });
  }
});

// update submit new voter
router.post('/voter/edit', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();

  
  
  // Get errors
  let errors = req.validationErrors();
  var proxies = function(){
    if(req.body.proxyFor == null){
      return 0;
    }else{
      return req.body.proxyFor.length;
    }
  }
  console.log("Prox="+proxies);
  if( proxies > 2){
    errors = ({"msg":"Only select two prxoies"});
  }

 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/voter');
    });
  } else {
    let voter = {};
    voter._id = req.body.voterId;
    voter._firstName = req.body.firstName;
    voter._surname = req.body.surname;
    voter._address = req.body.address;
    voter._proxyFor = req.body.proxyFor;

    let query = {_id: voter._id};

    Voter.update(query, voter, function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/admin/voter');
      }
    });
  }
});

//remove voter
router.post('/voter/remove', ensureAuthticated, isAdmin, function(req, res){
  let voter = {};
  voter._id = req.body.voterId;
  voter._firstName = req.body.firstName;
  voter._surname = req.body.surname;
  voter._address = req.body.address;
  voter._proxyFor = req.body.proxyFor;

  let query = {_id: voter._id};

  Voter.update(query, voter, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin/voter');
    }
  })
});
/* END of VOTER ROUTES*/

module.exports = router;
