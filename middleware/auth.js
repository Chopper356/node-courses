module.exports = function(req, res, next) {
	if(!req.session.isAuthen) {
		return res.redirect("/auth/login#login");
	}

	next();
}