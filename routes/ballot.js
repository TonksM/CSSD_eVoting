var express = require('express');
var router = express.Router();
let tempBallot = {_id:'tempID', candidates:[{_id:'idTonks',name:'Tonks',party:'Party3'},{_id:'idJon',name:'Jon',party:'Party2'},{_id:'idBen',name:'Ben',party:'Party1'}]};
const {ensureAuthticated} = require("../config/auth");

/* GET users listing. */
router.get('/', ensureAuthticated ,function(req, res, next) {
	//code to access database and get ballot

  res.render('ballot', tempBallot);
});

module.exports = router;
