const Message = require("../models/messageModel");

exports.index = async (req, res, next) => {
	try {
		const messages = await Message.find()
			.sort([["timestamp", "descending"]])
			.populate("user");
		return res.render("index", {
			title: "The Message Board",
			user: req.user,
			messages: messages,
		});
	} catch (err) {
		return next(err);
	}
};
