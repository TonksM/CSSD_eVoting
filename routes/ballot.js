var express = require('express');
var router = express.Router();
let tempBallot = {_id:'tempID', 
                  candidates:[{_id:'idTonks',_surname:"Ions",_firstName:'Tonks',_party:'Party3'},
                              {_id:'idBen',_surname:"Hadlow",_firstName:'Ben',_party:'Party2'},,
                              {_id:'idHatsings',_surname:"Hasting",_firstName:'Ben',_party:'Party1'},]};
const {ensureAuthticated} = require("../config/auth");

/* GET users listing. */
router.get('/', ensureAuthticated ,function(req, res, next) {
	//code to access database and get ballot

  res.render('ballot', tempBallot);
});

router.post('/cast_vote', function(req, res, next){

});
module.exports = router;
