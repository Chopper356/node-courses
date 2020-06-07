const keys = require("../keys");

module.exports = function(email) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: "Registration completed successfully. Your account has been successfully created, successful shopping!",
		html: `
			<h1>Welcome to our courses store!</h1>
			<h2>You have successfully created an account in our store. Your email: ${email}</h2>
			<h3>Wish you a happy shopping.</h3>
			<hr />
			<p>Go back to our website --> <a href="${keys.BASE_URL}">GO BACK!</a></p>
		`
	}
}