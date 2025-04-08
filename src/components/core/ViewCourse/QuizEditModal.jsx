import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { RiAddLine, RiDeleteBin6Line } from "react-icons/ri"
import { FiImage } from "react-icons/fi"
import { updateQuiz } from "../../../services/operations/quizAPI"

export default function QuizEditModal({ quiz, onClose, onQuizUpdate }) {
  const [title, setTitle] = useState(quiz?.title || "")
  const [questions, setQuestions] = useState(quiz?.questions || [])
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
        imageUrl: null,
      },
    ])
  }

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    if (field === "options") {
      newQuestions[index].options[value.index] = value.text
    } else {
      newQuestions[index][field] = value
    }
    setQuestions(newQuestions)
  }

  const handleImageUpload = async (e, questionIndex) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid JPEG, JPG or PNG image')
      return
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size too large. Maximum size is 2MB')
      return
    }

    try {
      // Create a preview URL for the image
      const reader = new FileReader()
      reader.onload = () => {
        const newQuestions = [...questions]
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          imageUrl: reader.result,
          imageFile: file // Store the file object for later upload
        }
        setQuestions(newQuestions)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error handling image upload:', error)
      toast.error('Failed to process image')
    }
  }

  const handleRemoveImage = (questionIndex) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      imageUrl: null
    }
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      toast.error("Quiz title is required")
      return
    }

    if (questions.length === 0) {
      toast.error("Quiz must have at least one question")
      return
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        toast.error("All questions must have content")
        return
      }

      if (question.options.some(option => !option.trim())) {
        toast.error("All options must be filled")
        return
      }
    }

    try {
      setLoading(true)
      console.log('Preparing quiz data for update:', {
        quizId: quiz._id,
        title: title.trim(),
        questionsCount: questions.length
      })

      // Create FormData for the entire quiz
      const formData = new FormData()
      formData.append('quizId', quiz._id)
      formData.append('title', title.trim())

      // Process questions and handle image uploads
      const processedQuestions = questions.map(question => ({
        question: question.question.trim(),
        options: question.options.map(opt => opt.trim()),
        correctOption: question.correctOption,
        // Don't include the full image data in the question object
        imageUrl: question.imageUrl ? true : false
      }))

      formData.append('questions', JSON.stringify(processedQuestions))

      // Append image files separately
      questions.forEach((question, index) => {
        if (question.imageFile) {
          formData.append(`questionImage_${index}`, question.imageFile)
        }
      })

      console.log('Sending quiz update request...')
      const response = await updateQuiz(formData, token)

      if (!response.success) {
        throw new Error(response.message || "Failed to update quiz")
      }

      toast.success("Quiz updated successfully")
      onQuizUpdate(response.quiz)
      onClose()
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast.error(error.message || "Failed to update quiz")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64Data) => {
    const byteCharacters = atob(base64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: 'image/jpeg' })
  }

  return (
    <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-richblack-5 mb-6">Edit Quiz</h2>

        <form onSubmit={handleSubmit}>
          {/* Quiz Title */}
          <div className="mb-6">
            <label className="block text-richblack-50 mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-richblack-700 text-richblack-5 rounded-md p-3"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-richblack-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <label className="text-richblack-50">Question {qIndex + 1}</label>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-pink-500 hover:text-pink-600"
                  >
                    <RiDeleteBin6Line className="text-xl" />
                  </button>
                </div>

                {/* Question Text */}
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                  className="w-full bg-richblack-600 text-richblack-5 rounded-md p-3 mb-4"
                  placeholder="Enter question"
                />

                {/* Image Upload */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, qIndex)}
                        className="hidden"
                      />
                      <FiImage className="text-xl text-richblack-200" />
                      <span className="text-sm text-richblack-200">
                        {question.imageUrl ? "Change Image" : "Add Image"}
                      </span>
                    </label>
                    {question.imageUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(qIndex)}
                        className="text-pink-500 hover:text-pink-600 text-sm"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  {question.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={question.imageUrl}
                        alt="Question"
                        className="max-h-40 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "options", {
                            index: oIndex,
                            text: e.target.value,
                          })
                        }
                        className="w-full bg-richblack-600 text-richblack-5 rounded-md p-3"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-richblack-50 mb-2">Correct Answer</label>
                  <select
                    value={question.correctOption}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "correctOption", parseInt(e.target.value))
                    }
                    className="w-full bg-richblack-600 text-richblack-5 rounded-md p-3"
                  >
                    {question.options.map((_, index) => (
                      <option key={index} value={index}>
                        Option {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-2 bg-richblack-700 text-yellow-50 px-4 py-2 rounded-md mt-6 hover:bg-richblack-600"
          >
            <RiAddLine className="text-lg" />
            Add Question
          </button>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-yellow-50 text-black font-semibold hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}