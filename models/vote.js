var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var voteSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _vote:          ObjectId
})

module.exports = mongoose.model('Vote', voteSchema);