module.exports = {
	ensureNotVoted: (req,res,next)=>{
        var Voter = require('../models/voter');

        let voterId = req.user;
        Voter.findOne({_id: voterId}, function(err, voter){
            if(!voter._hasVoted){
                return(next());
            }else{
                
                res.redirect("./ballot/vote_msg?msg=voted")
            }
        });
	}
}