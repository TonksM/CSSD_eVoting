/** @module isAdmin.js 
* Determines whether or not a user is an admin
*/

module.exports = {
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
