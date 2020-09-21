const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		author: {
			type: String,
			default: "Anonymous",
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			default: 5,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Artisan",
		},
	},
	{ timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
