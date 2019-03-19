var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var voteSchema = new Schema({
    _vote:          {type: ObjectId, ref: 'Candidate' }
})

module.exports = mongoose.model('Vote', voteSchema);