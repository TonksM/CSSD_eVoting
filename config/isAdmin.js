/** @module isAdmin.js 
* Determines whether or not a user is an admin
*/

module.exports = {
	isAdmin: (req,res,next)=>{
		var Admin = require('../models/admin');

      //  let voterId = req.user;
      //  Admin.findOne({_adminId: voterId}, function(err, voter){
          //  if(voter){
               return(next());
          //  }else{
            //    res.redirect("/ballot");
          //  }
      //  });
	}
}
