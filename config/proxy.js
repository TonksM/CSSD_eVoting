module.exports = {
	isNotProxy: (req,res,next)=>{
        var Voter = require('../models/voter');
        let voterId = req.user;
        Voter.findOne({_id: voterId}, function(err, voter){
            if(voter._proxyFor == null ){
                return(next());
            }else{
                res.redirect("./proxy")
            }
        });
    },
    isNotAWP: (req, res, next)=>{ // AWP = Associated With Proxy
        var Voter = require('../models/voter');
        let voterId = req.user;
        Voter.findOne({_proxyFor: voterId}, (err, voter)=>{
            if(err) return(next());
            if(voter == null){
                return(next());
            }else{
                res.redirect("./ballot/vote_msg?msg=prox");
            }
        });
    }
}