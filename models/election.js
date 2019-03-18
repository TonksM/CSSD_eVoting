var mongoose = require('mongoose');
const Vote = require('../models/vote');
const Constituency = require('../models/constituency');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var electionSchema = new Schema({
    _electionName:      String,
    _electionStart:     String,
    _electionEnd:       String,
    _constituencies:    [{type: ObjectId, ref: 'Constituency'}],
    _allCandidates:     [{type: ObjectId, ref: 'Candidate'}],
    _winningCandidate:  {type: ObjectId, ref: 'Candidate'},
    _deleted:      	Boolean
});

electionSchema.methods.tallyElection = function(){
	console.log("Enter tallyElection");
	const ids = this._constituencies.map(constituency => constituency._id);
	console.log("All candidates " + this._allCandidates);
	var chartData = {};
	Vote.find({_id:this._allCandidates}).populate({path:'_vote', populate:{path:'_party'}}).exec((err,votes) =>{
		console.log(votes);
		chartData = this.generateCharData(votes);
	});
	console.log("Leaving tallyElection");
	return(chartData);
}

electionSchema.methods.setAllCandidates = function(callback){
	console.log("Enter setAllCandidates");
	
	this._constituencies.forEach(constituency=>{
		constituency._candidates.forEach(candidate=>{
			this._allCandidates.push(candidate._id);
		});
	})

	
	console.log(this._allCandidates);
	console.log("Leaving setAllCandidates");
	return(callback());
}

electionSchema.methods.generateCharData = function(votes){
	var chartData = {partyId:[], partyColours:[], partyName:[], partyVotes:[]};
	votes.forEach((err,vote)=>{
		if(chartData.partyId.toString().includes(vote._vote._party._id))
		{	
			var index = array.indexOf(vote._vote._party._id);
			chartData.partyVotes[index]++;
		}else{
			partyId.push(vote._vote._party._id);
			partyName.push(vote._vote._party._name);
			partyVotes.push(1);
		}
	});
	return(chartData);
}
module.exports = mongoose.model('Election', electionSchema);
