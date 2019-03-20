/** @module Voter Schema */

/**
 * Mongoose Schema to hold information about a voter
 * @name Voter Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _password{string} Hashed password
 * @param _firstName{string} First Name
 * @param _surname{string} Surname
 * @param _hasVoted{Boolean} Whether the voter has voted or not
 * @param _lastLogin{ObjectID} When the voter last logged in
 * @param _address{ObjectID} Reference to an address
 * @param _loginAttempts{number} Number of times the user has incorrectly logged in
 * @param _proxyFor{ObjectID} Array of references to the voters proxies
 * @param _deleted{Boolean} Whether the document is deleted or not
 * @callback Voter
 */


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
    _loginAttempts: Number,
    _proxyFor:      [{type: ObjectId, ref: 'Voter', default: null}]
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