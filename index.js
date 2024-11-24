const express = require("express");
const { connectToMongoDB } = require("./db/connection");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog.model");
const app = express();

const port = 5000;

// db connection

connectToMongoDB("mongodb://127.0.0.1:27017/Blowy")
	.then(console.log("MongoDB connected successfully!"))
	.catch((error) => console.log(`MongoDB error: ${error}`));

// router
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
const {
	checkForAuthenticationCookie,
} = require("./middlewares/authentication");

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
// EndPoints
app.get("/", async (req, res) => {
	const blogs = await Blog.find({});

	return res.render("home", {
		user: req.user,
		blogs: blogs,
	});
});
app.use("/user", userRouter);
app.use("/blog", blogRouter);

// Server start here.
app.listen(
	port || process.env.PORT,
	console.log(
		`Server is started at port: http://localhost:${
			port || process.env.PORT
		}`
	)
);
