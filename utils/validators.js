const {body} = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
	body("email", "Enter the correct email").isEmail().custom( async (value, {req}) => {
		try {
			const user = await User.findOne({email: value});

			if(user) {
				return Promise.reject("A user with this email already exists, try another one or log in to your account.");
			}
		}
		catch(err) {
			console.log(err);
		}
	}).normalizeEmail(),
	body("password", "Password must be at least 6 characters and should consist only of latin characters").isLength({min: 6, max: 56}).isAlphanumeric().trim(),
	body("confirm").custom( (value, {req}) => {
		if(value != req.body.password) {
			throw new Error("Password mismatch");
		}
		return true;
	}).trim(),
	body("name", "Name must be at least 3 characters").isLength({min: 3, max: 22}).trim()
]

// exports.loginValidators = [
// 	body("email", "This user does not exist.").isEmail().normalizeEmail()
// 	body("password").
// ]

exports.courseValidators = [
	body("title").isLength({min: 3}).withMessage("Name minimum length 3 characters").trim(),
	body("price").isNumeric().withMessage("Enter the correct price"),
	body("image").isURL().withMessage("Enter the correct URL")
]