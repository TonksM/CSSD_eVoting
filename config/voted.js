var Voter = require('../models/voter');

module.exports = {
	ensureNotVoted: (req,res,next)=>{
        //This function checks the 
        let voterId = req.user;

        Voter.findOne({_id: voterId}, function(err, voter){
            if(!voter._hasVoted){
                return(next());
            }else{
                
                res.redirect("./ballot/vote_msg?msg=voted")
            }
        });
    },
    ensureNotAllVoted: (req, res, next) =>{
        let voterId = req.user;

        Voter.findOne({_id: voterId}).populate('_proxyFor').exec( (err, voter) =>{
            var allVoted = [];
            voter._proxyFor.forEach(function(p) {
                allVoted.push(p._hasVoted);
            });
            allVoted.push(voter._hasVoted);
            console.log("All voted" + allVoted);
            if(allVoted.every(function(voted){return voted})){
                res.redirect("./proxy/ballot/vote_msg?msg=voted")
            }else{
                return(next());
            }
        });

    }
}