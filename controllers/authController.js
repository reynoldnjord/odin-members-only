const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.signup_get = (req, res, next) => {
	res.render("signup_form", { title: "Sign Up" });
};

exports.signup_post = [
	body("username")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Username must be at least 6 characters."),
	body("password")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Password must be at least 6 characters."),

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("ERROR!");
			return res.render("signup_form", {
				title: "Sign Up",
				passwordConfirmationError: "Passwords must be the same",
			});
		}

		try {
			const isUserInDB = await User.find({ username: req.body.username });
			if (isUserInDB.length > 0)
				return res.render("signup_form", {
					title: "Sign Up",
					error: "User already exists",
				});
			// If username does not exist, continute to register new user to db
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) return next(err);
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
					member: false,
					admin: false,
					avatar: req.body.avatar,
				}).save((err) => (err ? next(err) : res.redirect("/log-in")));
			});
		} catch (err) {
			return next(err);
		}
	},
];

exports.login_get = (req, res) => {
	// If user is already logged in, redirect them to the homepage
	if (res.locals.currentUser) return res.redirect("/");
	res.render("login_form", { title: "Login" });
};

exports.login_post = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/log-in",
});

exports.logout_get = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect("/");
	});
};
