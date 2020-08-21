const mongoose = require("mongoose");

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
const Artisan = mongoose.model("Artisan", artisanSchema);
module.exports = Artisan;
