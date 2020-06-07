const {Router} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../keys");
const regEmail = require("../emails/registration");

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

router.post("/register", async (req, res) => {
	try {
		const {name, email, password, repeat} = req.body;
		const candidate = await User.findOne({email});

		if(candidate) {
			req.flash("errorRegister", "A user with this email already exists, try another one or log in to your account.");
			res.redirect("/auth/login#register");
		}
		else {
			const hashPassword = await bcrypt.hash(password, 10);
			const user = new User({ name, email, password: hashPassword, cart: { items: [] } });
			await user.save();
			await transporter.sendMail(regEmail(email));
			res.redirect("/auth/login#login");
		}
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

module.exports = router