/** @module config/auth */

/**
 * Ensures the users is authenticated by checking a web token stored as a session =
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback ensureAuthticated
 */
module.exports = {
	ensureAuthticated: (req,res,next)=>{
		if(req.isAuthenticated()){
			return(next());
		}
		else{
			res.redirect("/");
		}
	}
}
