// Import the Mongoose library
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		userType: {
			type: String,
			enum: ["Student", "Instructor"],
			required: true,
		},
		accountType: {
			type: String,
			enum: ["Admin", "Student", "Instructor"],
			required: true,
			default: "Instructor"
		},
		active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
		},
		courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],
		coin:{
			type: Number,
			default: 0,
		},
		totalcoin: {
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("user", userSchema);