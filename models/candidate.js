var mongoose = require('mongoose');
var addressSchema = require('./address');
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var candidateSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _firstName:     String,
    _surname:       String,
    _party:         {type: ObjectId, ref: 'Party'},
    _address:       [addressSchema],
    _constituency:  {type: ObjectId, ref: 'Constituency'}
})

module.exports = mongoose.model('Candidate', candidateSchema);