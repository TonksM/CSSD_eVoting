const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Voter = mongoose.model('Voter');
var nodemailer = require('nodemailer');

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
	      //if(!voter._hasVoted){
		      if(voter._loginAttempts > 3){
		      	console.log("Too many failed login attempts have been made");
		      	//cssdevoting@gmail.com
			    	//cssdevoting12345
			    	var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'cssdevoting@gmail.com',
					    pass: 'cssdevoting12345'
					  }
					});
					var mailOptions = {
					  from: 'cssdevoting@gmail.com',
					  to: email,
					  subject: 'EVoting Lockout',
					  text: 'Dear Voter, Your account has been locked. If this was you go to this address to unlock it http://localhost:3000/users/unlockAccount?id='+voter._id+' If this was not you, speak to a system admin'
					};

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
			      bcrypt.compare(password, voter._password,(err,isMatch)=>{
			      	if(isMatch){
			      		console.log("Valid");
			      		console.log("Voter:" + voter);
			      		console.log("Done:" + done);
								voter.resetLoginAttempts();
								voter.save();
			      		return done(null, voter);
			      	}else{
						voter.incrementLoginAttempts();
						voter.save();
			      		console.log("Password invalid");
			      		return done(null, false, { message: "Email and password combination is incorrect"});
			      	}
			      });
			      if(voter._loginAttempts > 3){

			    }
		      	
			  }
			/*}
			else{
			  	console.log("Voter has already voted");
	      		return done(null, false, { message: "Vote already passed"});
		  	}*/
	      }).catch(err => console.log(err));

	})
	);

	passport.serializeUser((voter,done)=>{
		console.log(voter);
		done(null, voter._id);
	});

	passport.deserializeUser((id,done)=>{
		console.log("deserializeUser : " + id);
		Voter.findById({_id:id},(err,voter)=>{
			console.log(voter);
			done(err,voter);
		});
	});

}