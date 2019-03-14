var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var addressSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _addressLine1:  String,
    _addressLine2:  String,
    _addressLine3:  String,
    _city:          String,
    _county:        String,
    _postcode:      String
});

module.exports = mongoose.model('Address', addressSchema);