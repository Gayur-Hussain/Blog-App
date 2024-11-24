const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { join } = require("path");
const { generateTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN"],
			default: "USER",
		},
		avatar: {
			type: String,
			default: "/images/default.png",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	const user = this;
	if (!user.isModified("password")) return;
	const salt = randomBytes(16).toString();
	const hashedPassword = createHmac("sha256", salt)
		.update(user.password)
		.digest("hex");

	this.salt = salt;
	this.password = hashedPassword;

	next();
});

userSchema.static(
	"matchPasswordAndGenerateToken",
	async function (email, password) {
		const user = await this.findOne({ email });
		if (!user) throw new Error("User not found!");

		const salt = user.salt;
		const hashedPassword = user.password;
		const newHashedPassword = createHmac("sha256", salt)
			.update(password)
			.digest("hex");

		if (hashedPassword !== newHashedPassword)
			throw new Error("Incorrect Password");
		const token = generateTokenForUser(user);
		return token;
	}
);

const User = model("User", userSchema);
module.exports = {
	User,
};
