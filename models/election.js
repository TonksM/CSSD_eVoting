var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var electionSchema = new Schema({
    _electionName:      String,
    _electionStart:     String,
    _electionEnd:       String,
    _constituencies:    [{type: ObjectId, ref: 'Constituency'}],
    _allCandidates:     [{type: ObjectId, ref: 'Candidate'}],
    _winningCandidate:  {type: ObjectId, ref: 'Candidate'}
});

electionSchema.methods.tallyElection = function(){
	
}
module.exports = mongoose.model('Election', electionSchema);
