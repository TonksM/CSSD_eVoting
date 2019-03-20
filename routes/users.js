var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
const Voter = mongoose.model('Voter');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
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

router.post('/requestPasswordReset', function(req, res, next) {
  req.checkBody('email', 'Email is required to reset password').notEmpty();
  console.log(req.body.email);
  let errors = req.validationErrors();
  if(errors){
    req.flash('errors',errors);
    req.session.save(function () {
      res.redirect('/');
    });
  }
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
              req.flash('loginError',"Email has been sent");
              req.session.save(function () {
                res.redirect('/');
              });
            }
          });
        }
        else{
          req.flash('loginError',"Email has been sent");
            req.session.save(function () {
              res.redirect('/');
          });
        }
  });
});




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
