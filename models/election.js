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

electionSchema.methods.tallyElection = function(callback){
	console.log("Enter tallyElection");
	const ids = this._constituencies.map(constituency => constituency._id);
	this.setAllCandidates(function(candidates){
		console.log(candidates);
		Vote.find({_vote:candidates}).populate({path:'_vote', populate:{path:'_party'}}).exec((err,votes) =>{
			console.log("Votes");
			console.log(votes);
			var chartData = {partyId:[], partyColours:[], partyNames:[], partyVotes:[], currentLead:"test"};
			votes.forEach(vote=>{
				console.log("vote");
				console.log(vote);
				if(chartData.partyId.toString().includes(vote._vote._party._id))
				{	
					var index = chartData.partyId.indexOf(vote._vote._party._id);
					console.log(index);
					var votes = chartData.partyVotes[index] + 1;
					chartData.partyVotes[index] = votes;
				}
				else{
					chartData.partyId.push(vote._vote._party._id);
					chartData.partyNames.push(vote._vote._party._name);
					chartData.partyColours.push(vote._vote._party._partyColour);
					chartData.partyVotes.push(1);
				}
			});
			var previousVotes = -1;
			var currentLead = "";
			var i = 0;
			chartData.partyVotes.forEach(partyVotes=>{
				if(partyVotes>previousVotes)
				{
					currentLead = i;
					previousVotes = partyVotes;
					console.log(chartData.partyNames[i]);
				}
				i++;
			});

			chartData.currentLead = chartData.partyNames[currentLead];
			console.log("chartData: ");
			console.log(chartData);
			callback(chartData);
		});
	});	
}

electionSchema.methods.setAllCandidates = function(callback){
	console.log("Enter setAllCandidates");
	
	this._constituencies.forEach(constituency=>{
		console.log(constituency);
		constituency._candidates.forEach(candidate=>{
			console.log(candidate);
			this._allCandidates.push(candidate._id);
		});
	})

	console.log(this._allCandidates);
	console.log("Leaving setAllCandidates");
	callback(this._allCandidates);
}

electionSchema.methods.generateChartData = function(votes){
	var chartData = {partyId:[], partyColours:[], partyName:[], partyVotes:[]};
	votes.forEach((err,vote)=>{
		console.log("vote");
		console.log(vote);
		if(chartData.partyId.toString().includes(vote._vote._party._id))
		{	
			var index = array.indexOf(vote._vote._party._id);
			chartData.partyVotes[index]++;
		}else{
			chartData.partyId.push(vote._vote._party._id);
			chartData.partyName.push(vote._vote._party._name);
			chartData.partyVotes.push(1);
		}
	});
	console.log("chartData: ");
		console.log(chartData);
	return(chartData);
}
module.exports = mongoose.model('Election', electionSchema);
