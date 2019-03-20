/** @module Constituency Schema */

/**
 * Mongoose Schema to hold information about a constituency
 * @name Constituency Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _name{string} Name
 * @param _candidates{ObjectID} Array of references to candidates IDs
 * @param _validPostcodes{string} Array of Strings to hold postcodes
 * @param _victor{ObjectID} Reference to a candidate
 * @param _totalVotes{ObjectID} Total Votes
 * @param _totalVoters{ObjectID} Total Voters
 * @param _deleted{Boolean} Whether the document is deleted or not
 * @callback Constituency
 */

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
    _totalVoters:       Number,
    _deleted:      	Boolean
})

module.exports = mongoose.model('Constituency', constituencySchema);
