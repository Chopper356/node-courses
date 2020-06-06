const {Router} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const router = new Router();

router.get("/login", async (req, res) => {
	res.render("auth/login", {
		title: "Authorization",
		isLogin: true
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
				res.redirect("/auth/login#register");
				console.log("error error")
			}
		}
		else {
			res.redirect("/auth/login#register");
			console.log("error")
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
			res.redirect("/auth/login#register");
		}
		else {
			const hashPassword = await bcrypt.hash(password, 10);
			const user = new User({ name, email, password: hashPassword, cart: { items: [] } });
			await user.save();
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