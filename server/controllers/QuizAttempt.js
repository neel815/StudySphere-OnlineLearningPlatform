const QuizAttempt = require("../models/QuizAttempt")
const Quiz = require("../models/Quiz")
const User = require("../models/User")
const mongoose = require("mongoose")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Submit a quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, score, answers } = req.body
    const userId = req.user.id

    if (!quizId || score === undefined || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Verify the quiz exists
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      })
    }

    // Create new quiz attempt
    const quizAttempt = await QuizAttempt.create({
      quiz: quizId,
      user: userId,
      score,
      answers,
      completedAt: new Date(),
    })

    // Populate the quiz details in the response
    await quizAttempt.populate('quiz', 'title questions')

    return res.status(200).json({
      success: true,
      message: "Quiz attempt submitted successfully",
      quizAttempt,
    })
  } catch (error) {
    console.error("Error submitting quiz attempt:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz attempt",
      error: error.message,
    })
  }
}

// Get quiz attempts for a specific quiz and user
exports.getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params
    const userId = req.user.id

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      })
    }

    // Verify the quiz exists
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      })
    }

    // Find all attempts for this quiz by this user, sorted by most recent first
    const attempts = await QuizAttempt.find({
      quiz: quizId,
      user: userId,
    })
      .sort({ completedAt: -1 })
      .populate('quiz', 'title questions')

    return res.status(200).json({
      success: true,
      attempts,
    })
  } catch (error) {
    console.error("Error fetching quiz attempts:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz attempts",
      error: error.message,
    })
  }
}

// Get quiz leaderboard
exports.getQuizLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params
    console.log("quizId", quizId);

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      })
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      })
    }
 
    // Get all attempts for this quiz
    const attempts = await QuizAttempt.aggregate([
      { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData"
        }
      },
      { $unwind: "$userData" },
      {
        $group: {
          _id: "$user",
          user: { $first: "$userData" },
          score: { $max: "$score" },
          completedAt: { $max: "$completedAt" }
        }
      },
      {
        $project: {
          "user._id": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.email": 1,
          "user.image": 1,
          score: 1,
          completedAt: 1
        }
      },
      { $sort: { score: -1, completedAt: -1 } }
    ])

    console.log("attempts", attempts);

    // Format the leaderboard data
    const leaderboard = attempts.map(entry => ({
      user: entry.user,
      score: entry.score,
      totalQuestions: quiz.questions.length,
      percentage: ((entry.score / quiz.questions.length) * 100).toFixed(2),
      attemptDate: entry.completedAt,
    }))

    return res.status(200).json({
      success: true,
      leaderboard,
    })

  } catch (error) {
    console.error("Error in getQuizLeaderboard:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    })
  }
}