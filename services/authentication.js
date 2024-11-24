const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const generateTokenForUser = (user) => {
	const { _id, email, avatar, role, userName } = user;
	const payload = {
		_id,
		email,
		avatar,
		role,
		userName,
	};
	const token = jwt.sign(payload, secret);
	return token;
};

const verifyToken = (token) => {
	const payload = jwt.verify(token, secret);
	return payload;
};

module.exports = {
	generateTokenForUser,
	verifyToken,
};
