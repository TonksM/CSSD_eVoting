/** @module models/Vote Schema */

/**
 * Mongoose Schema to hold in information of a vote
 * @name Vote Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _vote{ObjectID} Reference to a candidates object ID
 * @callback Vote
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var voteSchema = new Schema({
    _vote:          {type: ObjectId, ref: 'Candidate' }
})

module.exports = mongoose.model('Vote', voteSchema);