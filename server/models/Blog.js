const mongoose = require("mongoose");

// Define the Courses schema
const blogSchema = new mongoose.Schema({
    blogName: { type: String },
    blogDescription: { type: String },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    thumbnail: {
        type: String,
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model("Blog", blogSchema);