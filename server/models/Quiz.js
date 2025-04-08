const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [{
      type: String,
      required: true,
      trim: true,
    }],
    correctOption: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  }],
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
})

module.exports = mongoose.model("Quiz", quizSchema)