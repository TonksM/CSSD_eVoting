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