/** @module Admin Routes */
var express = require('express');
var router = express.Router();
const flash = require('connect-flash'); // used within admin to display messages when an edit/update or delete was submitted
const bcrypt = require('bcryptjs');
const {ensureAuthticated} = require("../config/auth");
const {isAdmin} = require("../config/isAdmin"); // used to be passed as a parameter set if the voter is admin or not
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const Candidate = require('../models/candidate');
const Ballot = require('../models/ballot');
const Party = require('../models/party');
const Address = require('../models/address');
const Voter = require('../models/voter');
/**
 * Route to admin index
 * @name Admin index route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/'
 */
router.get('/', ensureAuthticated, isAdmin, function(req, res, next) {
	res.render('admin',{err: req.flash('errors')});
});
/* START of PARTY ROUTES*/
/* GET PARTY listing. */
/**
 * Route to the  edit party view
 * @name Admin  party edit route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/party'
 */
router.get('/party', ensureAuthticated, isAdmin, function(req, res, next) {
  Party.find({_deleted:false}).then(parties =>{                                 // checks to see if any party has been added already
	  console.log(parties);                                                       // logs the current parties
    res.render('editParty',{parties:parties,err: req.flash('errors')});
    console.log(req.flash('errors'))
  });
});
/* GET PARTY add view. */
/**
 * Route to render a party add view
 * @name Admin  party add route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/party/add'
 */
router.get('/party/add', ensureAuthticated, isAdmin, function(req, res, next) {
	res.render('addParty', {err: req.flash('errors')});														// renders the view form to add a party
});
// submit new party
/**
 * Route to add a new party to the database
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  add party route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/party/add'
 */
router.post('/party/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();    //body to add name of party
  req.checkBody('partyColour', 'Party colour is required').notEmpty(); // body to add patry colour

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);               												// if theres an error use Flash to display
    req.session.save(function () {
      res.redirect('/admin/party/add');
    });
  } else {
    let party = new Party();
    party._name = req.body.partyName;
    party._partyColour = req.body.partyColour;
    party._deleted = false;

    party.save(function(err){																					// saves the added party
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
/**
 * Route to edit the party
 * @name Admin  party edit route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/party/edit'
 */
router.post('/party/edit', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('partyName', 'Party name is required').notEmpty();   // body to edit the party name in
  req.checkBody('partyColour', 'Party colour is required').notEmpty(); // body to edit party colour in

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    req.flash('errors',errors);																			// displays error
    res.redirect('/admin/party');
  } else {
    let party = {};
    party._id = req.body.partyId;
    party._name = req.body.partyName;
    party._partyColour = req.body.partyColour;
    party._deleted = false;

    console.log('Party:' + party);
    let query = {_id: party._id};

    Party.update(query, party, function(err){                // updates the ediited party
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
/**
 * Route to remove party  index
 * if no id is provided redirect to /admin/party
 * @name Admin  party remove  route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/party/remove'
 */
router.post('/party/remove', ensureAuthticated, isAdmin, function(req, res){    // lists each form of party and removes it by ID/Name/PartyColour and sets deleted to true
  let party = {};
  party._id = req.body.partyId;
  party._name = req.body.partyName;
  party._partyColour = req.body.partyColour;
  party._deleted = true;

  console.log('Party:' + party);
  let query = {_id: party._id};

  Party.update(query, party, function(err){																			// updates the party view and renders party audit
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
/**
 * Route to address index
 * @name Admin  party edit route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/address'
 */
router.get('/address', ensureAuthticated, isAdmin, function(req, res, next) {
	Address.find({_deleted:false}).then(addresses =>{
    console.log(addresses);
    res.render('editAddress',{addresses:addresses,err: req.flash('errors')});  //renders the edit address form
  });
});
/* GET ADDRESS add view. */
/**
 * Route to render an add address view
 * @name Admin  party edit route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/address/add'
 */
router.get('/address/add', ensureAuthticated, isAdmin, function(req, res, next) { // renders the add address form
	res.render('addAddress',{err: req.flash('errors')});
});
// submit new candidate
/**
 * Route to add and adrress for a slected user
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  index route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/address/add'
 */
router.post('/address/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();      // body to add first address
  req.checkBody('city', 'City Name is required').notEmpty();                   // body to add city
  req.checkBody('county', 'County is required').notEmpty();										// body to add the county
  req.checkBody('postcode', 'Postcode is required').notEmpty();								//body to add the postcode

  // Get errors
  let errors = req.validationErrors();																				// if no bodys was enterted correctly show validation.

  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {																							//saves the added address
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
/**
 * Route to edit a party for a selected user.
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  party edit route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'address/edit'
 */
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

    Address.update(query, address, function(err){      //update the address with the new values passed in
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
/**
 * Route  the removing of an address for a slected user
 * if no id is provided redirect to /admin/address
 * @name Admin  Remove party route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/address/remove'
 */
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

  Address.update(query, address, function(err){                                 // updates the adress values with the removed values
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
/**
 * Route to candidate index
 * @name Admin  candidate index route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/candidate'
 */
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
/**
 * Route to render the add candidate view
 * @name Admin  camdidate add route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/admin/candidate/add'
 */
router.get('/candidate/add', ensureAuthticated, isAdmin, function(req, res, next) {
	Party.find({_deleted:false}).then(parties=>{
    Address.find({_deleted:false}).then(addresses=>{
      res.render('addCandidate',{parties:parties,addresses:addresses,err: req.flash('errors')});
    });
  });
});

// submit new candidate
/**
 * Route to add a candidtate to a sleclted party to the database.
 * @name Admin  add candidate route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/admin/candidate/add'
 */
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
/**
 * Route to edit candidate  index
 * @name Admin  candidate edit route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/candidate/edit'
 */
router.post('/candidate/edit', ensureAuthticated, isAdmin, function(req, res){

  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();              // body to enter the first name in
  req.checkBody('surname', 'Surname is required').notEmpty();										// body to enter the surname in
  req.checkBody('party', 'Party is required').notEmpty(); 											// body to enter party in
  req.checkBody('address', 'Address is required').notEmpty();									  // body to enter address in

  // Get errors
  let errors = req.validationErrors();

  if(errors){																																		// flash validation if theres any errors.
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/candidate');																					//redirects the page to the edit candidate view
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

    Candidate.update(query, candidate, function(err){														//updates the editied values of candidates
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
/**
 * Route to remove candidate index
 * @name Admin  remove candidate route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/candidate/remove'
 */
router.post('/candidate/remove/', ensureAuthticated, isAdmin, function(req, res){
  let candidate = new Candidate();
  candidate._id = req.body.candidateId;
  candidate._firstName = req.body.firstName;
  candidate._surname = req.body.surname;
  candidate._party = req.body.party;
  candidate._deleted = true;

  let query = {_id: candidate._id};

  Candidate.update(query, candidate, function(err){                             // updates the removed candidate
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
/**
 * Route to constituency index
 * @name Admin  constituency index route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/address'
 */
router.get('/constituency', ensureAuthticated, isAdmin, function(req, res, next) {
	Constituency.find({_deleted:false}).then(constituencies =>{
    Candidate.find({_deleted:false}).then(candidates =>{
      res.render('editConstituency',{err: req.flash('errors'),candidates:candidates,constituencies:constituencies});
    });
  });
});
/* GET CONSTITUENCEY add view. */
/**
 * Route to render the consituency add view form for the selected user
 * @name Admin  constituency  add index route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/constituency/add'
 */
router.get('/constituency/add', ensureAuthticated, isAdmin, function(req, res, next) {
  Candidate.find({_deleted:false}).then(candidates =>{
	 res.render('addConstituency',{err: req.flash('errors'), candidates:candidates});
  });
});
/**
 * Route to add a constituency for the slected User to the database
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  constituency add index route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/constituency/add'
 c
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
/**
 * Route to the edit constituency view
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin constituency edit route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/constituency/edit'
 */
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
/**
 * Route to remove a user elected constituency from database
 * if no id is provided redirect to /admin/constituency
 * @name Admin  constituency index route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/consituency/remove'
 */
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
/**
 * Route to election edit edit screeview
 * @name Admin  election  route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/election'
 */
router.get('/election', ensureAuthticated, isAdmin, function(req, res, next) {
  Election.find({_deleted:false}).then(elections =>{
    Constituency.find({_deleted:false}).then(constituencies=>{
      res.render('editElection',{err: req.flash('errors'), constituencies:constituencies,elections:elections});
    });
  });
});
/* GET ELECTION add view. */
/**
 * Route to render the add election add view form for the admin
 * @name Admin  election add route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/election/add'
 */
router.get('/election/add', ensureAuthticated, isAdmin, function(req, res, next) {
	Constituency.find({_deleted:false}).then(constituencies=>{
    res.render('addElection',{err: req.flash('errors'), constituencies:constituencies});
  });
});
/* POST ELECTION */
/**
 * Route to add a election to the database
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  election add  route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/election/add'
 */
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
/**
* Route to edit a election for a selected user.
* checks the users if inputs are valid if not error messages are displayed
 * @name Admin  elecition edit route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/election/edit'
 */
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
/**
*Route to remove an election from database
* if no id is provided redirect to /admin/election
 * @name Admin  election edit  route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route..
 * @callback 'admin/address/remove'
 */
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
/**
 * Route to results index
 * @name Admin  results route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/results'
 */
router.get('/results', ensureAuthticated, isAdmin, function(req, res, next) {
  var electionsChartData = [];
  function displayResults(electionsChartData){
    res.render('results',{err: req.flash('errors'), electionsChartData:electionsChartData});
  }
  var itemsProcessed = 0;
  Election.find({_deleted:false}).populate({path:'_constituencies', populate:{path:'_candidates', populate:{path:'_party'}}}).exec((err,elections) =>{
    if(elections !=null){
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
    else{
      let errors = {'msg':'There are no elections to view the results of'};
      req.flash('errors',errors);
      req.session.save(function () {
        res.redirect('/admin');
      });
    }

  });
});
/* START of VOTER ROUTES*/
/* GET VOTER listing. */
/**
 * Route to voter route
 * @name Admin  vote route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/voter'
 */
router.get('/voter', ensureAuthticated, isAdmin, function(req, res, next) {
  Voter.find().then(voters =>{
    console.log(voters);
     Address.find({_deleted:false}).then(addresses=>{
      res.render('editVoter',{err: req.flash('errors'), addresses:addresses,voters:voters});
    });
  });
});
/* GET VOTER add view. */
/**
 * Route to render voter add page.
 * @name Admin  voter add route
 * @param RequestType GET
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'admin/voter/add'
 */
router.get('/voter/add', ensureAuthticated, isAdmin, function(req, res, next) {
  Voter.find().then(voters =>{
     Address.find({_deleted:false}).then(addresses=>{
      res.render('addVoter',{err: req.flash('errors'), addresses:addresses,voters:voters});
    });
  });
});
/* POST VOTER */
/**
 * Route to add a voter to the database
 * checks the users if inputs are valid if not error messages are displayed
 * @name Admin  voter add route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/voter/add'
 */
router.post('/voter/add', ensureAuthticated, isAdmin, function(req, res){
  // Express validator
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Email address is required').notEmpty();
  // Get errors
  let errors = req.validationErrors();
  var proxies = function(){
    if(req.body.proxyFor == null){
      return 0;
    }else{
      return req.body.proxyFor.length;
    }
  }
 if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/admin/voter/add');
    });
  } else {
    let voter = new Voter();
    console.log("Voter: "+voter);
    bcrypt.hash(req.body.password, 12, function(err, hash) {
        voter._password = hash;
        voter._email = req.body.email;
        voter._id = req.body.candidateId;
        voter._firstName = req.body.firstName;
        voter._surname = req.body.surname;
        voter._address = req.body.address;
        voter._proxyFor = req.body.proxyFor;
        voter.save(function(err){
          if(err) {
            console.error(err);
            return;
          } else {
            res.redirect('/admin');
          }
        });
      });
  }
});
// update submit new voter
/**
 * Route to voter edit route
 * @name Admin voter edit route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback '/admin/voter/edit'
 */
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
    voter._email = req.body.email;

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
/**
	*Route to remove a voter from the database
	* if no id is provided redirect to /admin/voter
 * Route to remove a voter route
 * @name Admin  remove voter route
 * @param RequestType POST
 * @param ensureAuthticated Checks if user is authenticated
 * @param isAdmin Checks if user is an admin
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @callback 'admin/voters/remove'
 */
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
