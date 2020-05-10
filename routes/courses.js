const {Router} = require("express");
const Course = require("../models/course")
const router = Router();

router.get("/", (req, res) => {
	Course.getAll().then(courses => {
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

	let course = await Course.getById(req.params.id)

	res.render("course-edit", {
		title: `Edit ${course.title}`,
		course
	})
});

router.post("/edit", async (req, res) => {
	await Course.update(req.body);

	res.redirect(`/courses`)
})

router.get("/:id", async (req, res) => {
	let course = await Course.getById(req.params.id)
	res.render("course", {
		layout: 'empty',
		title: `Course ${course.title}`,
		course
	})
});

module.exports = router