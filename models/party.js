/** @module Party Schema */

/**
 * Mongoose Schema to hold information about a party
 * @name Party Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _name{string} Party Name
 * @param _partyColour{string} The colour of the party
 * @param _deleted{Boolean} Whether the document is deleted or not
 * @callback Party
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var partySchema = new Schema({
    _name: 				String,
    _partyColour: 		String,
    _deleted:      	Boolean
})

module.exports = mongoose.model('Party', partySchema);