const express = require("express");
const { User } = require("../models/user.model");
const router = express.Router();

router.get("/login", (req, res) => {
	res.render("login");
});
router.get("/signup", (req, res) => {
	res.render("signup");
});
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const token = await User.matchPasswordAndGenerateToken(email, password);

		res.cookie("token", token).redirect("/");
	} catch (error) {
		res.render("login", {
			error: "Invalid email or password!",
		});
	}
});
router.post("/signup", async (req, res) => {
	const { userName, email, password } = req.body;
	User.create({
		userName,
		email,
		password,
	});
	res.redirect("/");
});

router.get("/logout", (req, res) => {
	res.clearCookie("token").redirect("/");
});
module.exports = router;
