module.exports = {
	isNotProxy: (req,res,next)=>{
        var Voter = require('../models/voter');
        let voterId = req.user;
        Voter.findOne({_id: voterId}, function(err, voter){
            if(!voter._proxyFor != null ){
                return(next());
            }else{
                res.redirect("./user/proxy")
            }
        });
	}
}