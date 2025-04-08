import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { FiImage } from "react-icons/fi"
import { FaPlus, FaTrash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { createQuiz } from "../../../../../services/operations/quizAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"

export default function QuizModal({ modalData, setModalData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [questions, setQuestions] = useState([{
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    imageUrl: null,
  }])

  useEffect(() => {
    if (modalData) {
      setValue("quizTitle", "")
    }
  }, [modalData, setValue])

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
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('image', file)

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

  const addQuestion = () => {
    setQuestions([...questions, {
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      imageUrl: null,
    }])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index)
      setQuestions(newQuestions)
    }
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const onSubmit = async (data) => {
    if (!data.quizTitle?.trim()) {
      toast.error("Please enter a quiz title")
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`Question ${i + 1} is empty`)
        return
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          toast.error(`Option ${j + 1} in Question ${i + 1} is empty`)
          return
        }
      }
    }
    
    setLoading(true)
    try {
      // Create FormData for the entire quiz
      const formData = new FormData()
      formData.append('sectionId', modalData)
      formData.append('title', data.quizTitle.trim())

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

      console.log('Sending quiz creation request...')
      const response = await createQuiz(formData, token)

      if (!response.success) {
        throw new Error(response.message || "Failed to create quiz")
      }

      // Update the course with the new quiz
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData
          ? {
              ...section,
              quizzes: [...(section.quizzes || []), response.data],
            }
          : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
      
      toast.success("Quiz created successfully")
      setModalData(null)
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast.error(error.message || "Failed to create quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800/90">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700/90 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Create Quiz
          </p>
          <button onClick={() => setModalData(null)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Quiz Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="quizTitle">
              Quiz Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="quizTitle"
              placeholder="Enter quiz title"
              {...register("quizTitle", { required: true })}
              className="form-style w-full !bg-richblack-700/75"
            />
            {errors.quizTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Quiz title is required
              </span>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="rounded-lg border border-richblack-600 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-richblack-5">
                    Question {qIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-pink-200 hover:text-pink-300"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    placeholder="Enter your question"
                    className="form-style w-full !bg-richblack-700/75"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
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
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctOption === oIndex}
                        onChange={() => updateQuestion(qIndex, "correctOption", oIndex)}
                        className="form-radio text-yellow-50"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="form-style flex-1 !bg-richblack-700/75"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 text-yellow-50 hover:text-yellow-100"
            >
              <FaPlus />
              Add Question
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => setModalData(null)}
              className="rounded-md bg-richblack-700/75 px-4 py-2 text-richblack-50"
            >
              Cancel
            </button>
            <IconBtn
              disabled={loading}
              text={loading ? "Creating Quiz..." : "Create Quiz"}
            />
          </div>
        </form>
      </div>
    </div>
  )
}