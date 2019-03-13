var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var ballotSchema = new Schema({
    _id:                {type: ObjectId, default: mongoose.Types.ObjectId()},
    _candidates:        [{type: ObjectId}],
    _constituencyId:    ObjectId
})

module.exports = mongoose.model('Ballot', ballotSchema);