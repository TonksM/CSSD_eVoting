module.exports = {
	ensureAuthticated: (req,res,next)=>{
		//if(req.isAuthenticated()){
			return(next());
		//}
		//else{
		//	res.redirect("/");
		//}
	}
}