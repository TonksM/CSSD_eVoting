const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Voter = mongoose.model('Voter');

module.exports = passport=>{
	passport.use(new LocalStrategy({
	  usernameField: 'email'
	}, (email, password, done) => {
	  Voter.findOne({ _email:email })
	    .then(voter => {
	      if(!voter) {
	      	console.log("Email ivalid");
	        return done(null, false, { message:"That email is not registered!"});
	      }

	      if(!voter._hasVoted)
	      {
		      bcrypt.compare(password, voter._password,(err,isMatch)=>{
		      	if(isMatch){
		      		console.log("Valid");
		      		console.log("Voter:" + voter);
		      		console.log("Done:" + done);
		      		return done(null, voter);
		      	}else{
		      		console.log("Password invalid");
		      		return done(null, false, { message: "Password is incorrect"});
		      	}
		      });
		  }else{
		  	console.log("Voter has already voted");
      		return done(null, false, { message: "Vote already passed"});
		  }
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