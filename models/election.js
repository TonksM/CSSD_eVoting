/** @module Election Schema */

/**
 * Mongoose Schema to hold information about a constituency
 * @name Election Schema
 * @param _id{ObjectID} Mongodb generated unique ID
 * @param _electionName{string} Election Name
 * @param _electionStart{string} Election Start Date
 * @param _electionEnd{string} Election End Date
 * @param _constituencies{ObjectID} Array of references to consituencies
 * @param _allCandidates{ObjectID} Array of references to candidates
 * @param _winningCandidate{ObjectID} Reference to the Winning candidate
 * @param _deleted{Boolean} Whether the document is deleted or not
 * @callback Election
 */

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
    _deleted:      		Boolean
});

/**
 * Function to tally up all of the votes that have been place in the election
 * @name tallyElection
 * @param callback{function} callback
 * @callback tallyElection
 */
electionSchema.methods.tallyElection = function(callback){
	console.log("Enter tallyElection");
	this.setAllCandidates(function(candidates){
		console.log(candidates);
		const ids = candidates.map(candidate => candidate._id);
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
			console.log("Candidates: ");
			console.log(candidates);
			const parties = candidates.map(candidate => candidate._party);
			console.log("Parties: ");
			console.log(parties);
			parties.forEach(party=>{
				if(!chartData.partyId.toString().includes(party._id.toString()))
				{
					chartData.partyId.push(party._id);
					chartData.partyNames.push(party._name);
					chartData.partyColours.push(party._partyColour);
					chartData.partyVotes.push(0);
				}
			});
			chartData.currentLead = chartData.partyNames[currentLead];
			console.log("chartData: ");
			console.log(chartData);
			callback(chartData);
		});
	});	
}

/**
 * Function to set all the candidates of the election
 * @name setAllCandidates
 * @param callback{function} callback
 * @callback setAllCandidates
 */
electionSchema.methods.setAllCandidates = function(callback){
	console.log("Enter setAllCandidates");
	
	this._constituencies.forEach(constituency=>{
		console.log(constituency);
		constituency._candidates.forEach(candidate=>{
			console.log(candidate);
			this._allCandidates.push(candidate);
		});
	})

	console.log(this._allCandidates);
	console.log("Leaving setAllCandidates");
	callback(this._allCandidates);
}

/**
 * Function to generate chart data for the chartjs chart in the results page
 * @name generateChartData
 * @param votes{[ObjectID]} Array pf references to Votes
 * @callback generateChartData
 */
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
