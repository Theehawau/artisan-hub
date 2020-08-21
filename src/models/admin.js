const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		},
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error('Password cannot contain "password"');
			}
		},
	},
});

// create new find method
adminSchema.statics.findByCredentials = async (email, password) => {
	const admin = await Admin.findOne({ email });
	if (!admin) throw new Error("Unable to Login");
	const isMatch = await bcrypt.compare(password, admin.password);
	if (!isMatch) throw new Error("Unable to Login");
	return admin;
};
// hash plain text password
adminSchema.pre("save", async function (next) {
	const admin = this;
	if (admin.isModified("password")) {
		admin.password = await bcrypt.hash(admin.password, 8);
	}
	next();
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
