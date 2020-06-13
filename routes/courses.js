const {Router} = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

function isOwner(course, req) {
	return course.userId.toString() == req.user._id.toString()
}

router.get("/", (req, res) => {
	Course.find().populate("userId", "email name").select("price title image").lean().then(courses => {
		res.render("courses.hbs", {
			title: "Courses",
			isCourses: true,
			userId: req.user ? req.user._id.toString() : null,
			courses
		});
	}).catch(err => {
		res.send("Error 404 not found")
	});
});

router.get("/:id/edit", auth, async (req, res) => {
	if(!req.query.allow ) {
		return res.redirect("/")
	}

	try {
		const course = await Course.findById(req.params.id).lean()

		if(!isOwner(course, req)) {
			return res.redirect("/courses");
		}
	
		res.render("course-edit", {
			title: `Edit ${course.title}`,
			course
		})

	}
	catch(err) {
		console.log(err)
	}

});

router.post("/edit", auth, async (req, res) => {
	try {
		const {_id} = req.body;
		delete req.body.id;
		const course = await Course.findById(_id);
		if(!isOwner(course, req)) {
			return res.redirect("/course");
		}

		Object.assign(course, req.body);
		await course.save();
	
		res.redirect(`/courses`)
	}
	catch(err) {
		console.log(err)
	}
})

router.get("/:id", async (req, res) => {
	try {
		const course = await Course.findById(req.params.id).lean();
		res.render("course", {
			layout: 'empty',
			title: `Course ${course.title}`,
			course
		})
	}
	catch(err) {
		console.log(err)
	}
});

router.post("/remove", auth, async (req, res) => {
	try {
		await Course.deleteOne({
			_id: req.body._id,
			userId: req.user._id
		});
		res.redirect("/courses");
	}
	catch(err) {
		console.log(err);
	}

});

module.exports = router