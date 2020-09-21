const mongoose = require("mongoose");
const Comment = require("./comments");
const artisanSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		phoneNumber: {
			type: Number,
			unique: true,
			required: true,
		},
		category: {
			type: String,
			lowercase: true,
			trim: true,
		},
		subscribed: {
			type: Boolean,
			default: false,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		lga: {
			type: String,
			required: true,
		},
		avatar: {
			type: Buffer,
		},
	},
	{
		timestamps: true,
	}
);
artisanSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "owner",
});
const Artisan = mongoose.model("Artisan", artisanSchema);
module.exports = Artisan;
