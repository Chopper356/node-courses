const {Router} = require("express");
const Card = require("../models/course");
const Course = require("../models/course");
const router = new Router()

router.post("/add", async (req, res) => {
	const course = await Course.getById(req.body.id);

	await Card.add(course);
	res.redirect('/card');
});

router.get("/", async (req, res) => {
	const card = await Card.fetch();

	res.render('card', {
		title: 'Basket',
		card
	});
});

module.exports = router;