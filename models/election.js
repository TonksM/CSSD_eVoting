var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var electionSchema = new Schema({
    _electionName:       String,
    _id:                {type: ObjectId, default: mongoose.Types.ObjectId()},
    _electionDate:      [{
                            _electionStart: Date,
                            _electionEnd: Date
                        }],
    _constituencies:    [{type: ObjectId, ref: 'Constituency'}],
    _allCandidates:     [{type: ObjectId, ref: 'Candidate'}],
    _winningCandidate:

})

electionSchema.methods.tallyElection = function(){
	console.log(this._loginAttempts);
	this._loginAttempts++;
}
electionSchema.methods.resetLoginAttempts = function(){
	console.log(this._loginAttempts);
	this._loginAttempts = 0;
}

module.exports = mongoose.model('Election', electionSchema);
