/** @module config/proxy Routes */

module.exports = {

    /**
     * This function checks if the Voter has a null value within their
        proxyFor_ field and if so directs them along the normal route.
        If they have a proxy, they will be redirected to the Proxy
        select screen
     * @name isNotProxy Checks if the current user is a proxy user
     * @param Request The request being sent to the route
     * @param Result The result being sent from the route
     * @param Next The callback function
     * @param Voter The Voter Mongoose Schema
     * @param voterId The current Voter's Id
     * @param _proxyFor The array containing all associated voters
     */

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

 /**
     * This function checks if the Voter is present within any other
        voter's proxyFor_ field and if not directs them along the 
        normal route. If they have are an associated voter for a proxy
        voter, they will be redirected to a short message state who is
        voting on their behalf
     * @name isNotAWP Checks if the current user is an associated user of a proxy
     * @param Request The request being sent to the route
     * @param Result The result being sent from the route
     * @param Next The callback function
     * @param Voter The Voter Mongoose Schema
     * @param voterId The current Voter's Id
     * @param _proxyFor The array containing all associated voters
     */
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