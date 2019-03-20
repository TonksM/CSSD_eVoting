/** @module Passport Config 
* Configures the passport package for how to log a user in.
*/

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Voter = mongoose.model('Voter');
var nodemailer = require('nodemailer');

/**
 * Function which is called to authorise the user's credentials
 * @name PassportAuthenticate
 * @callback PassportAuthenticate
 */
module.exports = passport=>{
	passport.use(new LocalStrategy({
	  usernameField: 'email'
	}, (email, password, done) => {
	  Voter.findOne({ _email:email })
	    .then(voter => {
	      if(!voter) {
	      	console.log("Email ivalid");
	        return done(null, false, { message:"Email and password combination is incorrect"});
	      }
		//Tonks - moved hasVoted its own config file to streamline the validation of the user and
		//				proxy voter performs a different test when determining if a voter and its
		//				associated accounts have voted


		//if the user has failed to log in more than 3 times then send an email
		//to them to inform them the account is locked with a link to unlock it
		if(voter._loginAttempts >= 3){
			console.log("Too many failed login attempts have been made");
			//Set up email options
			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'cssdevoting@gmail.com',
			    pass: 'cssdevoting12345'
			  }
			});
			//Set up Email message
			var mailOptions = {
			  from: 'cssdevoting@gmail.com',
			  to: email,
			  subject: 'EVoting Lockout',
			  text: 'Dear Voter, Your account has been locked. If this was you go to this address to unlock it http://localhost:3000/users/unlockAccount?id='+voter._id+' If this was not you, speak to a system admin'
			};

			//Send the email off to the voter
			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
      		return done(null, false, { message: "Too many failed login attempts have been made and this account is locked"});
	      }
	      else{
	      	  //Encrypt the inputted password and compare it to the stored hashed password in the database
		      bcrypt.compare(password, voter._password,(err,isMatch)=>{
		      	//if there is a match then reset the login attempts and redirect
		      	if(isMatch){
		      		console.log("Valid");
		      		console.log("Voter:" + voter);
		      		console.log("Done:" + done);
					voter.resetLoginAttempts();
					voter.save();
		      		return done(null, voter);
		      	}else{
		      		//else increment the login attempts, save the voter and redirect back the login page
					voter.incrementLoginAttempts();
					voter.save();
		      		console.log("Password invalid");
		      		return done(null, false, { message: "Email and password combination is incorrect"});
		      	}
		      });
		  	}
      	}).catch(err => console.log(err));
	})
	);

	/**
	 * Function to deserialize the user for the session
	 * @name deserializeUser
	 * @callback deserializeUser
	 */
	passport.serializeUser((voter,done)=>{
		console.log(voter);
		done(null, voter._id);
	});

	/**
	 * Function to deserialize the user for the session
	 * @name deserializeUser
	 * @callback deserializeUser
	 */
	passport.deserializeUser((id,done)=>{
		console.log("deserializeUser : " + id);
		Voter.findById({_id:id},(err,voter)=>{
			console.log(voter);
			done(err,voter);
		});
	});

}