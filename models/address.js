/** @module Address Schema */

/**
 * Mongoose Schema for holding addresses
 * @name Address Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _addressLine1{string} Address line 1
 * @param _addressLine2{string} Address line 2
 * @param _addressLine3{string} Address line 3
 * @param _city{string} City
 * @param _county{string} County
 * @param _postcode{string} Postcode
 * @param _deleted{boolean} Whether the address document is deleted or not
 * @callback Address
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var addressSchema = new Schema({
    _addressLine1:  String,
    _addressLine2:  String,
    _addressLine3:  String,
    _city:          String,
    _county:        String,
    _postcode:      String,
    _deleted:      	Boolean
});

module.exports = mongoose.model('Address', addressSchema);