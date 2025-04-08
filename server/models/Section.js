const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
	sectionName: {
		type: String,
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			required: true,
			ref: "SubSection",
		},
	],
	materials: [
		{
			title: {
				type: String,
				required: true,
			},
			fileUrl: {
				type: String,
				required: true,
			},
			fileType: {
				type: String,
				required: true,
			},
		},
	],
	quizzes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz",
		},
	],
});

module.exports = mongoose.model("Section", sectionSchema);