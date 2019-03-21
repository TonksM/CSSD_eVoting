/** @module config/voted */
var Voter = require('../models/voter');

module.exports = {
    /**
     * Function which is called to redirect anyone who was voted
     * @name ensureNotVoted
     * @param Request The request being sent to the route
     * @param Response The response being sent from the route
     * @param Next The callback function
     * @callback PassportAuthenticate
     */
	ensureNotVoted: (req,res,next)=>{
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