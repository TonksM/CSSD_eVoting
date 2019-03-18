var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;
 
var adminSchema = new Schema({
    _adminId:       {type: ObjectId, ref: 'Voter' },
});

module.exports = mongoose.model('Admin', adminSchema);