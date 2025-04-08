const express = require("express")
const router = express.Router()

const { auth, isInstructor, isStudent } = require("../middlewares/auth")
const {
  createQuiz,
  getQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/Quiz")
const {
  submitQuizAttempt,
  getQuizAttempts,
  getQuizLeaderboard,
} = require("../controllers/QuizAttempt")

// Quiz routes (protected with auth middleware)
router.post("/create", auth, isInstructor, createQuiz)
router.get("/get", auth, getQuiz)
router.delete("/delete", auth, isInstructor, deleteQuiz)
router.put("/update", auth, isInstructor, updateQuiz)

// Quiz attempt routes (protected with auth middleware)
router.post("/attempt/submit", auth, submitQuizAttempt)
router.get("/attempts/:quizId", auth, getQuizAttempts)
router.get("/leaderboard/:quizId", auth, getQuizLeaderboard)

module.exports = router