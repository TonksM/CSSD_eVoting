var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
const Voters = mongoose.model('Voter');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

/* POST users listing. */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();

  var err = req.validationErrors();

  if(err){
  	console.log(err);
  	res.redirect('login', {err:err})
  }
  else{
  	console.log('Valid Inputs');
  	passport.authenticate('local', {
  		successRedirect:'/admin',
  		failureRedirect:'/',
      failureFlash:true
  	})(req,res,next);
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
