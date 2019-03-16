var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var ballotSchema = new Schema({
    _candidates:        [{type: ObjectId, ref: 'Candidate'}],
    _constituencyId:    {type: ObjectId, ref: 'Constituency'},
    _deleted:      	Boolean
})

module.exports = mongoose.model('Ballot', ballotSchema);