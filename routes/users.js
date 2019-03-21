/** @module User Routes */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
const Voter = mongoose.model('Voter');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

/* GET users listing. */
/**
 * Route to users index
 * @name Users index route
 * @param RequestType GET
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/'
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

/* POST users listing. */
/**
 * Route to login where the user's 
 * @name Users login route
 * @param RequestType POST
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/login'
 */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  //Check inputs to make sure they are not empty
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();

  var err = req.validationErrors();
  //If at least one of the inputs are empty then redirect back with associated errors
  if(err){
  	req.flash('inputError',err);                                      // if theres an error use Flash to display
    req.session.save(function () {
      res.redirect('/');
    });
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

/**
 * Route to logout the current user
 * @name Users logout route
 * @param RequestType GET
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/logout'
 */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect("/");
});

/**
 * Route to unlock a users account 
 * @name Users unlock account
 * @param RequestType GET
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/unlockAccount'
 */
router.get('/unlockAccount', function(req, res, next) {
  console.log(req.param('id'));
  Voter.findOne({_id:req.param('id')}).then(voter => {
    voter._loginAttempts = 0;
    voter.save(function(err){
      if(err) {
        console.error(err);
        res.redirect('/');
        return;
      } else {
        res.redirect('/');
      }
    });
  });
});

/**
 * Route to request a password reset from the login page
 * Sends an email to a valid email
 * @name Users request password reset
 * @param RequestType POST
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/requestPasswordReset'
 */
router.post('/requestPasswordReset', function(req, res, next) {
  req.checkBody('email', 'Email is required to reset password').notEmpty();
  console.log(req.body.email);
  let errors = req.validationErrors();
  if(errors){
    req.flash('inputError',errors);
    req.session.save(function () {
      res.redirect('/');
    });
  }
  else{
  var email = req.body.email;
  Voter.findOne({_email:email}).then(voter=>{
    console.log(voter);
    if(voter != null){
      var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cssdevoting@gmail.com',
              pass: 'cssdevoting12345'
            }
          });
          var mailOptions = {
            from: 'cssdevoting@gmail.com',
            to: voter._email,
            subject: 'EVoting Password Reset',
            text: 'Dear Voter, You have requested a password change. If this was you go to this address to unlock it http://localhost:3000/users/passwordReset?id='+voter._id+' If this was not you, speak to a system admin'
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              req.flash('inputError',{"msg":"Email has been sent"});
              req.session.save(function () {
                res.redirect('/');
              });
            }
          });
        }
        else{
          req.flash('inputError',{"msg":"Email invalid"});
            req.session.save(function () {
              res.redirect('/');
          });
        }
  });
}
});

/**
 * Route to show the password reset page
 * @name Users password reset page
 * @param RequestType GET
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/passwordReset'
 */
router.get('/passwordReset', function(req, res, next) {
  console.log(req.param('id'));
  Voter.findOne({_id:req.param('id')}).then(voter => {
    if(voter){
      res.render('passwordReset', {err:req.flash('errors'),voter:voter});
    }else
    {
      res.redirect('/');
    }
  });
});


/**
 * Route to change a users password
 * Checks whether the two passwords the user submits
 * If they match then encrypt the passwords and
 * chnage the users password, if not then redirect to the login
 * @name Users request password reset
 * @param RequestType POST
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback 'users/passwordReset'
 */
router.post('/passwordReset', function(req, res, next) {
  var id = req.body.voterId;
  req.checkBody('newPassword', 'Password is required').notEmpty();
  req.checkBody('confirmPassword', 'Please confirm the password').notEmpty();
  let password = req.body.newPassword;
  let errors = req.validationErrors();
  if(!password == req.body.confirmPassword){
    errors = ({"msg":"Passwords need to match"});
  }

  if(errors){
    req.flash('errors',errors);
      req.session.save(function () {
      res.redirect('/users/passwordReset?id='+id);
    });
  }
  Voter.findOne({_id:id}).then((voter) => {
    if(!voter){
      req.flash('errors',{"msg":"Incorrect Id Consult Admin"});
        req.session.save(function () {
        res.redirect('/users/passwordReset?id='+id);
      });
    }else
    {
      bcrypt.hash(password, 12, function(err, hash) {
        voter._password = hash;
        voter.save(function(err){
          if(err) {
            console.error(err);
            return;
          } else {
            res.redirect('/');
          }
        });
      });
    }
  });
});

module.exports = router;
