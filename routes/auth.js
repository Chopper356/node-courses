const {Router} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {validationResult} = require("express-validator")
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const {registerValidators} = require("../utils/validators");
// const {loginValidators} = require("../utils/validators");

const router = new Router();
const transporter = nodemailer.createTransport(sendgrid({
	auth: {api_key: keys.SENDGRID_API_KEY}
}));

router.get("/login", async (req, res) => {
	res.render("auth/login", {
		title: "Authorization",
		isLogin: true,
		errorLogin: req.flash("errorLogin"),
		errorLoginPass: req.flash("errorLoginPass"),
		errorRegister: req.flash("errorRegister")
	});
});

router.post("/login", async (req, res) => {

	try {
		const {email, password} = req.body;
		const candidate = await User.findOne({email});

		if(candidate) {
			const areSame = await bcrypt.compare(password, candidate.password);
			
			if(areSame) {
				req.session.user = candidate;
				req.session.isAuthen = true;
				
				req.session.save(err => {
					if(err) {
						throw err;
					}
					res.redirect("/courses");
				});
			}
			else {
				req.flash("errorLoginPass", "Password is incorrect.")
				res.redirect("/auth/login#login");
			}
		}
		else {
			req.flash("errorLogin", "This user does not exist.")
			res.redirect("/auth/login#login");
		}
	}
	catch(err) {
		console.log(err);
	}

	
});

router.post("/register", registerValidators, async (req, res) => {
	try {
		const {name, email, password} = req.body;
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			req.flash("errorRegister", errors.array()[0].msg);
			return res.status(422).redirect("/auth/login#register");
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, password: hashPassword, cart: { items: [] } });
		await user.save();
		await transporter.sendMail(regEmail(email));
		res.redirect("/auth/login#login");
	}
	catch(err) {
		console.log(err);
	}
});

router.get("/logout", async (req, res) => {
	req.session.destroy(() => {
		res.redirect("/courses");
	});
});

router.get("/reset", (req, res) => {
	res.render('auth/reset', {
		title: "Forgot your password?",
		error: req.flash("error"),
	});
});

router.post("/reset", (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if(err) {
				req.flash("error", "Something went wrong, try again later.");
				return res.redirect("/auth/reset");
			}

			const token = buffer.toString("hex");
			const candidate = await User.findOne({email: req.body.email});

			if(candidate) {
				candidate.resetToken = token;
				candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; 
				await candidate.save();
				await transporter.sendMail(resetEmail(candidate.email, token));
				res.redirect("/auth/login");
			}
			else {
				req.flash("error", "This account does not exist.");
				res.redirect("/auth/reset");
			}
		});
	}
	catch(err) {
		console.log(err);
	}
});

router.get("/password/:token", async (req, res) => {
	if(!req.params.token) {
		return res.redirect("/auth/login");
	}
	
	try {

		const user = await User.findOne({
			resetToken: req.params.token,
			resetTokenExp: {$gt: Date.now()}
		});

		if(!user) {
			return res.redirect("/auth/login");
		}
		else {
			res.render("auth/password", {
				title: "Restore access",
				error: req.flash("error"),
				userId: user._id.toString(),
				token: req.params.token
			});
		}
	}
	catch(err) {
		console.log(err)
	}

});

router.post("/password", async (req, res) => {
	try {
		let user = await User.findOne({
			_id: req.body.userId,
			resetToken: req.body.token,
			resetTokenExp: {$gt: Date.now()}
		});

		if(user) {
			user.password = await bcrypt.hash(req.body.password, 10);
			user.resetToken = undefined;
			user.resetTokenExp = undefined;
			await user.save();
			res.redirect("/auth/login");
		}
		else {
			req.flash("errorLogin", "Request timed out");
			res.redirect("/auth/login");
		}
	}
	catch(err) {
		console.log(err);
	}
});

module.exports = router