var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var candidateSchema = new Schema({
    _firstName:     String,
    _surname:       String,
    _party:         {type: ObjectId, ref: 'Party'},
    _address:       {type: ObjectId, ref: 'Address'},
    _deleted:      	Boolean
})

module.exports = mongoose.model('Candidate', candidateSchema);
