const mongoose = require("mongoose")

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  }],
  completedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema)