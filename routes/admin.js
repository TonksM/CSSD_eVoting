var express = require('express');
var router = express.Router();
const {ensureAuthticated} = require("../config/auth");

/* GET users listing. */
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
/* END of BALLOT ROUTES*/

/* START of PARTY ROUTES*/
/* GET PARTY listing. */
router.get('/party', ensureAuthticated ,function(req, res, next) {
	res.render('editParty');
});

/* GET PARTY add view. */
router.get('/party/add', ensureAuthticated ,function(req, res, next) {
	res.render('addParty');
});
/* END of PARTY ROUTES*/

/* START of ADDRESS ROUTES*/
/* GET ADDRESS listing. */
router.get('/address', ensureAuthticated ,function(req, res, next) {
	res.render('editAddress');
});

/* GET ADDRESS add view. */
router.get('/address/add', ensureAuthticated ,function(req, res, next) {
	res.render('addAddress');
});
/* END of ADDRESS ROUTES*/

/* START of CANDIDATE ROUTES*/
/* GET CANDIDATE listing. */
router.get('/candidate', ensureAuthticated ,function(req, res, next) {
	res.render('editAddress');
});

/* GET CANDIDATE add view. */
router.get('/candidate/add', ensureAuthticated ,function(req, res, next) {
	res.render('addCandidate');
});
/* END of CANDIDATE ROUTES*/

/* START of CONSTITUENCEY ROUTES*/
/* GET CONSTITUENCEY listing. */
router.get('/constituency', ensureAuthticated ,function(req, res, next) {
	res.render('editConstituency');
});

/* GET CONSTITUENCEY add view. */
router.get('/constituency/add', ensureAuthticated ,function(req, res, next) {
	res.render('addConstituency');
});
/* END of CONSTITUENCEY ROUTES*/

/* START of ELECTION ROUTES*/
/* GET ELECTION listing. */
router.get('/election', ensureAuthticated ,function(req, res, next) {
	res.render('editElection');
});

/* GET ELECTION add view. */
router.get('/election/add', ensureAuthticated ,function(req, res, next) {
	res.render('addElection');
});
/* END of ELECTION ROUTES*/

module.exports = router;
