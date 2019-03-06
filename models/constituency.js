var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var constituencySchema = new Schema({
    _id:                {type: ObjectId, default: mongoose.Types.ObjectId()},
    _name:              String,
    _candidates:        [{type: ObjectId}],
    _validPostcodes:    [{type: String}],
    _victor:            {type: ObjectId, default: null},
    _totalVotes:        Number,
    _totalVoters:       Number
})

module.exports = mongoose.model('Vote', constituencySchema);