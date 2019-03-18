var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;
 
var voterSchema = new Schema({
    _email:         String,
    _password:      String,
    _firstName:     String,
    _surname:       String,
    _hasVoted:      {type: Boolean, default: false},
    _lastLogin:     {type: Date},
    _address:       {type: ObjectId, ref: 'Address' },
    _loginAttempts: Number
});

voterSchema.methods.incrementLoginAttempts = function(){
	console.log(this._loginAttempts);
	this._loginAttempts++;
}
voterSchema.methods.resetLoginAttempts = function(){
	console.log(this._loginAttempts);
	this._loginAttempts = 0;
}

module.exports = mongoose.model('Voter', voterSchema);