var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var partySchema = new Schema({
    _name: 				String,
    _partyColour: 		String,
    _deleted:      	Boolean
})

module.exports = mongoose.model('Party', partySchema);