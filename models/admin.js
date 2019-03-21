/** @module models/Admin Schema */

/**
 * Mongoose Schema for which user is a admin
 * @name Admin Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _adminId{ObjectID} Reference to a voter
 * @callback Admin
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;
 
var adminSchema = new Schema({
    _adminId:       {type: ObjectId, ref: 'Voter' },
});

module.exports = mongoose.model('Admin', adminSchema);