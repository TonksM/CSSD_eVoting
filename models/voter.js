var mongoose = require('mongoose');
var addressSchema = require('./address');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var voterSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _email:         String,
    _password:      String,
    _firstName:     String,
    _surname:       String,
    _hasVoted:      {type: Boolean, default: false},
    _lastLogin:     {type: Date},
    _address:       [addressSchema]
})

module.exports = mongoose.model('Voter', voterSchema);