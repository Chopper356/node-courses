module.exports = function(req, res, next) {
	res.locals.isAuth = req.session.isAuthen;
	res.locals.csrf = req.csrfToken();

	next();
}