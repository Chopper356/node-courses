const {Router} = require("express");
const Course = require("../models/course")
const router = Router();

router.get("/", (req, res) => {
	Course.find().lean().then(courses => {
		res.render("courses.hbs", {
			title: "Courses",
			isCourses: true,
			courses
		});
	}).catch(err => {
		res.send("Error 404 not found")
	});
});

router.get("/:id/edit", async (req, res) => {
	if(!req.query.allow ) {
		return res.redirect("/")
	}

	const course = await Course.findById(req.params.id).lean()

	res.render("course-edit", {
		title: `Edit ${course.title}`,
		course
	})
});

router.post("/edit", async (req, res) => {
	const {_id} = req.body;
	delete req.body._id;
	await Course.findByIdAndUpdate(_id, req.body).lean();

	res.redirect(`/courses`)
})

router.get("/:id", async (req, res) => {
	const course = await Course.findById(req.params.id).lean();
	res.render("course", {
		layout: 'empty',
		title: `Course ${course.title}`,
		course
	})
});

router.post("/remove", async (req, res) => {
	try {
		await Course.deleteOne({_id: req.body._id});
		res.redirect("/courses");
	}
	catch(err) {
		console.log(err)
	}

});

module.exports = router