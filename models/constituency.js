var mongoose = require('mongoose');
var partySchema = require('./party');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var constituencySchema = new Schema({
    _name:              String,
    _candidates:        [{type: ObjectId, ref: 'Candidate'}],
    _validPostcodes:    [{type: String}],
    _victor:            {type: ObjectId, ref: 'Candidate',default:null},
    _totalVotes:        Number,
    _totalVoters:       Number
})

module.exports = mongoose.model('Constituency', constituencySchema);
