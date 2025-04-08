const Section = require("../models/Section")
const Quiz = require("../models/Quiz")
const { uploadFileToCloudinary } = require("../utils/fileUploader")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.addQuiz = async (req, res) => {
  try {
    const { sectionId, quizTitle, questions } = req.body

    if (!sectionId || !quizTitle || !questions) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Parse questions if it's a string
    const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions

    // Create quiz
    const quiz = await Quiz.create({
      title: quizTitle,
      section: sectionId,
      questions: parsedQuestions,
    })

    // Update section with quiz reference
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          quizzes: quiz._id,
        },
      },
      { new: true }
    )

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Quiz added successfully",
      data: quiz,
    })
  } catch (error) {
    console.error("Error in addQuiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to add quiz",
      error: error.message,
    })
  }
}

exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId, sectionId } = req.body

    if (!quizId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Delete quiz
    await Quiz.findByIdAndDelete(quizId)

    // Update section by removing quiz reference
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          quizzes: quizId,
        },
      },
      { new: true }
    )

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error("Error in deleteQuiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error: error.message,
    })
  }
}

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, sectionId } = req.body
    const questions = JSON.parse(req.body.questions)

    if (!title || !questions || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      })
    }

    // Process images for questions that have them
    const processedQuestions = await Promise.all(questions.map(async (question, index) => {
      const questionData = {
        question: question.question,
        options: question.options,
        correctOption: question.correctOption,
      }

      // If this question has an image, process it
      if (question.imageUrl && req.files[`questionImage_${index}`]) {
        try {
          const uploadResult = await uploadImageToCloudinary(
            req.files[`questionImage_${index}`],
            'quiz-question-images'
          )
          questionData.imageUrl = uploadResult.secure_url
        } catch (error) {
          console.error(`Error uploading image for question ${index}:`, error)
          // Continue without the image if upload fails
        }
      }

      return questionData
    }))

    // Create the quiz with processed questions
    const quiz = await Quiz.create({
      title,
      questions: processedQuestions,
      section: sectionId,
    })

    // Add quiz to section
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          quizzes: quiz._id,
        },
      },
      { new: true }
    )

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    })
  }
}

// Get quiz details
exports.getQuiz = async (req, res) => {
  try {
    const { quizId } = req.query

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      })
    }

    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      })
    }

    return res.status(200).json({
      success: true,
      quiz,
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
      error: error.message,
    })
  }
}

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { quizId, title } = req.body
    const questions = JSON.parse(req.body.questions)

    if (!quizId || !title || !questions) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
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

    // Process images for questions that have them
    const processedQuestions = await Promise.all(questions.map(async (question, index) => {
      const questionData = {
        question: question.question,
        options: question.options,
        correctOption: question.correctOption,
      }

      // If this question has an image, process it
      if (question.imageUrl && req.files[`questionImage_${index}`]) {
        try {
          const uploadResult = await uploadImageToCloudinary(
            req.files[`questionImage_${index}`],
            'quiz-question-images'
          )
          questionData.imageUrl = uploadResult.secure_url
        } catch (error) {
          console.error(`Error uploading image for question ${index}:`, error)
          // If there was an existing image URL, keep it
          if (quiz.questions[index]?.imageUrl) {
            questionData.imageUrl = quiz.questions[index].imageUrl
          }
        }
      } else if (quiz.questions[index]?.imageUrl) {
        // Keep existing image URL if no new image was uploaded
        questionData.imageUrl = quiz.questions[index].imageUrl
      }

      return questionData
    }))

    // Update the quiz
    quiz.title = title
    quiz.questions = processedQuestions
    await quiz.save()

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    })
  } catch (error) {
    console.error("Error updating quiz:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error: error.message,
    })
  }
}