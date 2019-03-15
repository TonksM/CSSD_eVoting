var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var partySchema = new Schema({
    _name: 				String,
    _partyColour: 		String,
})

module.exports = mongoose.model('Party', partySchema);