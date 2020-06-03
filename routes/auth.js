const {Router} = require("express");
const User = require("../models/user");

const router = new Router();

router.get("/login", async (req, res) => {
	res.render("auth/login", {
		title: "Authorization",
		isLogin: true
	});
});

router.post("/login", async (req, res) => {
	const user = await User.findById("5ed04e0f5e6343241ced2a8b");
	req.session.user = user;
	req.session.isAuthen = true;
	
	req.session.save(err => {
		if(err) {
			throw err;
		}
		res.redirect("/courses");
	});
});

router.get("/logout", async (req, res) => {
	req.session.destroy(() => {
		res.redirect("/courses");
	});
});

module.exports = router