var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var electionSchema = new Schema({
    _id:                {type: ObjectId, default: mongoose.Types.ObjectId()},
    _electionDate:      [{
                            _electionStart: Date,
                            _electionEnd: Date
                        }],
    _constituencies:    [{type:ObjectId}],
    _allCandidates:     [{type:ObjectId}],

})

module.exports = mongoose.model('Vote', electionSchema);
