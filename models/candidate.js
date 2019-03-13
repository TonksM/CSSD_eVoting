var mongoose = require('mongoose');

var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var candidateSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _firstName:     String,
    _surname:       String,
    _party:         {type: String, default: "None"}
})

module.exports = mongoose.model('Candidate', candidateSchema);