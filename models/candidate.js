var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var candidateSchema = new Schema({
    _id:            {type: ObjectId, default: mongoose.Types.ObjectId()},
    _firstName:     String,
    _surname:       String,
    _party:         {type: ObjectId, ref: 'Party'},
    _address:       {type: ObjectId, ref: 'Address',default:null},
})

module.exports = mongoose.model('Candidate', candidateSchema);
