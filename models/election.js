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
	//for each candidate that is in the election, get their unique IDS
	this.setAllCandidates(function(candidates){
		console.log(candidates);
		const ids = candidates.map(candidate => candidate._id);
		//Get the votes that have been voted for this election
		Vote.find({_vote:candidates}).populate({path:'_vote', populate:{path:'_party'}}).exec((err,votes) =>{
			console.log("Votes");
			console.log(votes);
			//Set up array which will hold the chart data to be show in the result page
			var chartData = {partyId:[], partyColours:[], partyNames:[], partyVotes:[], currentLead:""};
			//For each vote check whether or not we have already seen the party
			votes.forEach(vote=>{
				console.log("vote");
				console.log(vote);
				if(chartData.partyId.toString().includes(vote._vote._party._id))
				{	
					//If we have seen the party before, increment the number of votes it has
					var index = chartData.partyId.indexOf(vote._vote._party._id);
					console.log(index);
					var votes = chartData.partyVotes[index] + 1;
					chartData.partyVotes[index] = votes;
				}
				else{
					//If we have not seen the party before, adds its config to the array
					chartData.partyId.push(vote._vote._party._id);
					chartData.partyNames.push(vote._vote._party._name);
					chartData.partyColours.push(vote._vote._party._partyColour);
					chartData.partyVotes.push(1);
				}
			});

			
			var previousVotes = -1;
			var currentLead = "";
			var i = 0;
			//Now that we have all the votes, we need to get who is currently in the lead
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
			//Now that we have all the information to do with the votes themselves
			//We need to make sure parties which have not been
			//voted for are included in the result as well
			parties.forEach(party=>{
				if(!chartData.partyId.toString().includes(party._id.toString()))
				{
					chartData.partyId.push(party._id);
					chartData.partyNames.push(party._name);
					chartData.partyColours.push(party._partyColour);
					chartData.partyVotes.push(0);
				}
			});
			//Get the current lead party and store it in the chart data
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
	
	//For each constituency, get its candidates and push them onto all candidates
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

module.exports = mongoose.model('Election', electionSchema);
