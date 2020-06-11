const keys = require("../keys");

module.exports = function(email, token) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: "Access recovery",
		html: `
			<h1>Forgot your password?</h1>
			<h2>If not, just ignore this message.</h2>
			<h3>Otherwise, click on the link below to reset your password.</h3>
			<p><a href="${keys.BASE_URL}/auth/password/${token}">Restore password</a></p>
			<hr />
			<p>Go back to our website --> <a href="${keys.BASE_URL}">GO BACK!</a></p>
		`
	}
}