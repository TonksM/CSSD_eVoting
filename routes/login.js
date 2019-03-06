var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* POST users listing. */
router.post('/authenticateUser', function(req, res, next) {
  res.redirect('/users');
});


module.exports = router;
