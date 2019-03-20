/** @module Candidate Schema */

/**
 * Mongoose Schema to hold information about a candidate
 * @name Candidate Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _firstName{string} First Name
 * @param _surname{string} Surname
 * @param _party{ObjectID} Reference to a party
 * @param _address{ObjectID} Reference to an address
 * @param _constituency{ObjectID} Reference to a constituency
 * @param _deleted{Boolean} Whether the document is deleted or not
 * @callback Candidate
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var candidateSchema = new Schema({
    _firstName:     String,
    _surname:       String,
    _party:         {type: ObjectId, ref: 'Party'},
    _address:       {type: ObjectId, ref: 'Address' },
    _constituency:  {type: ObjectId, ref: 'Constituency'},
    _deleted:      	Boolean
})

module.exports = mongoose.model('Candidate', candidateSchema);
