var express = require('express');
var router = express.Router();
const {ensureAuthticated} = require("../config/auth");
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const Candidate = require('../models/candidate');
const Ballot = require('../models/ballot');
const Party = require('../models/party');
const Address = require('../models/address');

/* GET admin view. */
router.get('/', ensureAuthticated ,function(req, res, next) {
	res.render('admin');
});

/* START of BALLOT ROUTES*/
/* GET ballot listing. */
router.get('/ballot', ensureAuthticated ,function(req, res, next) {
	res.render('editBallot');
});

/* GET ballot add view. */
router.get('/ballot/add', ensureAuthticated ,function(req, res, next) {
	res.render('addBallot');
});

// submit new party
router.post('/ballot/add', function(req, res){
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

// update submit new party
router.post('/ballot/edit/:id', function(req, res){
  let ballot = {};
  ballot._name = req.body.partyName;
  ballot._partyColour = req.body.partyColour;

  let query = {_id: req.params.id};

  Ballot.update(query, party, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Ballot Updated');
      res.redirect('/');
    }
  })
});
/* END of BALLOT ROUTES*/

/* START of PARTY ROUTES*/
/* GET PARTY listing. */
router.get('/party', ensureAuthticated ,function(req, res, next) {
  Party.find({}).then(parties =>{
    console.log(parties);
    res.render('editParty',{parties:parties});
  });
});

/* GET PARTY add view. */
router.get('/party/add', ensureAuthticated ,function(req, res, next) {
	res.render('addParty',{err:{}});
});

// submit new party
router.post('/party/add', function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();
  req.checkBody('partyColour', 'Party colour is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('addParty', {
      err: errors
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
        res.redirect('/admin');
      }
    });
  }
});

// update submit new party
router.post('/party/edit', function(req, res){
  let party = {};
  party._id = req.body.partyId;
  party._name = req.body.partyName;
  party._partyColour = req.body.partyColour;

  console.log('Party:' + party);
  let query = {_id: party._id};

  Party.update(query, party, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin');
    }
  })
});
/* END of PARTY ROUTES*/

/* START of ADDRESS ROUTES*/
/* GET ADDRESS listing. */
router.get('/address', ensureAuthticated ,function(req, res, next) {
	Address.find({}).then(addresses =>{
    console.log(addresses);
    res.render('editAddress',{addresses:addresses});
  });
});

/* GET ADDRESS add view. */
router.get('/address/add', ensureAuthticated ,function(req, res, next) {
	res.render('addAddress',{err:{}});
});

// submit new candidate
router.post('/address/add', function(req, res){
  // Express validator
  req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();
  req.checkBody('addressLine2', 'Address Line 2 is required').notEmpty();
  req.checkBody('addressLine3', 'Address Line 3 is required').notEmpty();
  req.checkBody('city', 'City Name is required').notEmpty();
  req.checkBody('county', 'County is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('addAddress', {
      err: errors
    });
  } else {
    let address = new Address();
    address._addressLine1 = req.body.addressLine1;
    address._addressLine2 = req.body.addressLine2;
    address._addressLine3 = req.body.addressLine3;
    address._city = req.body.city;
    address._county = req.body.county;
    address._postcode = req.body.postcode;

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
router.post('/address/edit', function(req, res){
  let address = {};
  address._id = req.body.partyId;
  address._addressLine1 = req.body.addressLine1;
  address._addressLine2 = req.body.addressLine2;
  address._addressLine3 = req.body.addressLine3;
  address._city = req.body.city;
  address._county = req.body.county;
  address._postcode = req.body.postcode;

  console.log('Address:' + address);
  let query = {_id: address._id};

  Party.update(query, address, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin');
    }
  })
});
/* END of ADDRESS ROUTES*/

/* START of CANDIDATE ROUTES*/
/* GET CANDIDATE listing. */
router.get('/candidate', ensureAuthticated ,function(req, res, next) {
	Candidate.find({}).then(candidates =>{
    console.log(candidates);
    Party.find({}).then(parties=>{
      Address.find({}).then(addresses=>{
        res.render('editCandidate',{candidates:candidates,parties:parties,addresses:addresses,err:{}});
      });  
    });
  });
});

/* GET CANDIDATE add view. */
router.get('/candidate/add', ensureAuthticated ,function(req, res, next) {
	Party.find({}).then(parties=>{
    Address.find({}).then(addresses=>{
      res.render('addCandidate',{parties:parties,addresses:addresses,err:{}});
    });
  });
});

// submit new candidate
router.post('/candidate/add', function(req, res){
  // Express validator
  req.checkBody('firstName', 'first name is required').notEmpty();
  req.checkBody('surname', 'surname is required').notEmpty();
  req.checkBody('party', 'Party is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.redirect('/admin/candidate/add');
  } else {
    let candidate = new Candidate();
    candidate._firstName = req.body.firstName;
    candidate._surname = req.body.surname;
    candidate._party = req.body.party;
    candidate._address = req.body.address;

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
router.post('/candidate/edit/', function(req, res){
  let candidate = new Candidate();
  candidate._id = req.body.id;
  candidate._firstName = req.body.firstName;
  candidate._surname = req.body.surname;
  candidate._party = req.body.party;

  let query = {_id: candidate._id};

  Candidate.update(query, candidate, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      res.redirect('/admin');
    }
  })
});
/* END of CANDIDATE ROUTES*/

/* START of CONSTITUENCEY ROUTES*/
/* GET CONSTITUENCEY listing. */
router.get('/constituency', ensureAuthticated ,function(req, res, next) {
	res.render('editConstituency',{err:{}});
});

/* GET CONSTITUENCEY add view. */
router.get('/constituency/add', ensureAuthticated ,function(req, res, next) {
  Candidate.find({}).then(candidates =>{
	 res.render('addConstituency',{err:{}, candidates:candidates});
  });
});

// submit new constituency
router.post('/constituency/add', function(req, res){
  // Express validator
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('candidates', 'candidates is required').notEmpty();
  req.checkBody('validPostcodes', 'postcode is required').notEmpty();


  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_constituency', {
      title: 'Add Constituency',
      errors: errors
    });
  } else {
    let constituency = new Constituency();
    constituency._name = req.body._name;
    constituency._candidates = req.body._candidates;
    constituency._validPostcodes = req.body._validPostcodes;

    constituency.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Constituency Added');
        res.redirect('/');
      }
    });
  }
});

// update submit new constituency
router.post('/constituency/edit/:id', function(req, res){
  let constituency = {};
  constituency._name = req.body._name;
  constituency._candidates = req.body._candidates;
  constituency._validPostcodes = req.body._validPostcodes;

  let query = {_id: req.params.id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Constituency Updated');
      res.redirect('/');
    }
  })
});

/* END of CONSTITUENCEY ROUTES*/

/* START of ELECTION ROUTES*/
/* GET ELECTION listing. */
router.get('/election', ensureAuthticated ,function(req, res, next) {
  Constituency.find({}).then(constituencies=>{
    res.render('editElection',{err:{}, constituencies:constituencies});
  });
});

/* GET ELECTION add view. */
router.get('/election/add', ensureAuthticated ,function(req, res, next) {
	Constituency.find({}).then(constituencies=>{
    res.render('addElection',{err:{}, constituencies:constituencies});
  });
});

/* POST ELECTION */
router.post('/election/add', function(req, res){
  // Express validator
  req.checkBody('name', 'Election name is required').notEmpty();
  req.checkBody('startDate', 'The start date of the election is required').notEmpty();
  req.checkBody('endDate', 'The end date of the election is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('addElection', {
      err: errors
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

// update submit new election
router.post('/election/edit/:id', function(req, res){
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
/* END of ELECTION ROUTES*/

module.exports = router;
