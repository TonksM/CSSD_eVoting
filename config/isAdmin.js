/** @module isAdmin*/

module.exports = {
    /**
     * Ensures the users stored in the session is an admin and redirects accordingly
     * @param Request The request being sent to the route.
     * @param Response The response being sent to the route.
     * @param Next The callback function.
     * @callback isAdmin
     */
	isAdmin: (req,res,next)=>{
		var Admin = require('../models/admin');
        //Gets the voter id and clooks for it in the admin table
        //If it is present in there then continue to admin route
        let voterId = req.user;
        Admin.findOne({_adminId: voterId}, function(err, voter){
            if(voter){
               return(next());
            }else{
                //else redirect to the ballot.
                res.redirect("/ballot");
            }
        });
	}
}
