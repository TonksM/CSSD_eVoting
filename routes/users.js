var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
const Voter = mongoose.model('Voter');
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
router.get('/unlockAccount', function(req, res, next) {
  console.log(req.param('id'));
  Voter.findOne({_id:req.param('id')}).then(voter => {
    voter._loginAttempts = 0;
    voter.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
