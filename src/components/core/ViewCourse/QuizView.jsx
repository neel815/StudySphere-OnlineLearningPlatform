import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { submitQuizAttempt, getQuizAttempts } from "../../../services/operations/quizAPI"
import { HiCheckCircle, HiXCircle, HiPencil } from "react-icons/hi"
import { FaTrophy } from "react-icons/fa"
import QuizEditModal from "./QuizEditModal"
import { apiConnector } from "../../../services/apiconnector"
import { quizEndpoints } from "../../../services/apis"

export default function QuizView({ quiz, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [previousAttempts, setPreviousAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  // Check if user is the quiz creator
  const isQuizCreator = user?._id === quiz?.createdBy

  useEffect(() => {
    const fetchPreviousAttempts = async () => {
      try {
        if (!quiz?._id || !token) return
        const attempts = await getQuizAttempts(quiz._id, token)
        setPreviousAttempts(attempts)
        
        // If there are previous attempts, show the latest result
        if (attempts && attempts.length > 0) {
          const latestAttempt = attempts[0]
          setScore(latestAttempt.score)
          setSelectedAnswers(
            latestAttempt.answers.reduce((acc, ans) => ({
              ...acc,
              [ans.questionIndex]: ans.selectedOption
            }), {})
          )
          setShowResults(true)
        }
      } catch (error) {
        console.error("Error fetching quiz attempts:", error)
      }
      setLoading(false)
    }

    fetchPreviousAttempts()
  }, [quiz?._id, token])

  const fetchLeaderboard = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${quizEndpoints.GET_QUIZ_LEADERBOARD_API}/${quiz._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (response.data.success) {
        setLeaderboardData(response.data.leaderboard)
      } else {
        toast.error("Failed to fetch leaderboard")
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast.error("Failed to fetch leaderboard")
    }
  }

  const toggleLeaderboard = async () => {
    if (!showLeaderboard) {
      await fetchLeaderboard()
    }
    setShowLeaderboard(!showLeaderboard)
  }

  // Add error handling for undefined quiz data
  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="p-6 bg-richblack-800 rounded-lg">
        <p className="text-xl text-richblack-5">Error: Quiz data is not available</p>
      </div>
    )
  }

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (showResults) return // Prevent changing answers when viewing results
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    })
  }

  const calculateScore = () => {
    let newScore = 0
    const answers = []
    quiz.questions.forEach((question, index) => {
      const selectedOption = selectedAnswers[index]
      const isCorrect = selectedOption === question.correctOption
      if (isCorrect) {
        newScore++
      }
      answers.push({
        questionIndex: index,
        selectedOption,
        isCorrect,
      })
    })
    return { score: newScore, answers }
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      toast.error("Please answer all questions before submitting")
      return
    }

    const { score: finalScore, answers } = calculateScore()
    setScore(finalScore)
    setShowResults(true)

    try {
      // Save quiz attempt
      const response = await submitQuizAttempt({
        quizId: quiz._id,
        score: finalScore,
        answers,
        token,
      })

      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to save quiz results')
      }

      // Update previous attempts
      const attempts = await getQuizAttempts(quiz._id, token)
      setPreviousAttempts(attempts)
      
      toast.success("Quiz results saved successfully!")
    } catch (error) {
      console.error("Error saving quiz results:", error)
      toast.error("Failed to save quiz results, but you can still view them")
    }
  }

  const handleRetake = () => {
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setScore(0)
  }

  const handleEditQuiz = () => {
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div className="p-6 bg-richblack-800 rounded-lg">
        <p className="text-xl text-richblack-5">Loading quiz data...</p>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="p-6 bg-richblack-800 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-richblack-5">Quiz Results</h2>
          <button
            onClick={toggleLeaderboard}
            className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-100 transition-all duration-200"
          >
            <FaTrophy className="text-lg" />
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
        </div>

        {showLeaderboard && (
          <div className="mb-6 p-4 bg-richblack-700 rounded-lg">
            <h3 className="text-xl font-semibold text-richblack-5 mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.user._id}
                  className="flex items-center justify-between p-3 bg-richblack-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-50 font-semibold">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      {entry.user.image && (
                        <img
                          src={entry.user.image}
                          alt={`${entry.user.firstName}'s profile`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-richblack-50">
                        {entry.user.firstName} {entry.user.lastName}
                      </span>
                    </div>
                  </div>
                  <div className="text-richblack-50">
                    {entry.score}/{entry.totalQuestions} ({entry.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          {isQuizCreator && (
            <button
              onClick={handleEditQuiz}
              className="flex items-center gap-2 bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-100"
            >
              <HiPencil className="text-lg" />
              Edit Quiz
            </button>
          )}
        </div>
        <p className="text-lg text-richblack-50 mb-4">
          Your Score: {score} out of {quiz.questions.length}
        </p>
        <p className="text-lg text-richblack-50 mb-4">
          Percentage: {((score / quiz.questions.length) * 100).toFixed(2)}%
        </p>

        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-richblack-5">Your Answers:</h3>
          {quiz.questions.map((question, qIndex) => {
            const selectedOption = selectedAnswers[qIndex]
            const isCorrect = selectedOption === question.correctOption

            return (
              <div 
                key={qIndex}
                className={`p-4 rounded-lg border ${
                  isCorrect ? "border-green-500" : "border-pink-500"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <HiCheckCircle className="text-green-500 text-xl mt-1" />
                  ) : (
                    <HiXCircle className="text-pink-500 text-xl mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-richblack-5 font-medium mb-2">
                      {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-3 rounded-md ${
                            oIndex === question.correctOption
                              ? "bg-green-500/20 text-green-500"
                              : oIndex === selectedOption && oIndex !== question.correctOption
                              ? "bg-pink-500/20 text-pink-500"
                              : "bg-richblack-700 text-richblack-50"
                          }`}
                        >
                          {option}
                          {oIndex === question.correctOption && (
                            <span className="ml-2 text-green-500">(Correct Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {previousAttempts && previousAttempts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-richblack-5 mb-4">Previous Attempts:</h3>
            <div className="space-y-2">
              {previousAttempts.map((attempt, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-richblack-700 rounded-lg">
                  <p className="text-richblack-50">
                    Attempt {previousAttempts.length - index}
                  </p>
                  <p className="text-richblack-50">
                    Score: {attempt.score}/{quiz.questions.length} 
                    ({((attempt.score / quiz.questions.length) * 100).toFixed(2)}%)
                  </p>
                  <p className="text-richblack-300 text-sm">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleRetake}
            className="bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-100"
          >
            Retake Quiz
          </button>
          <button
            onClick={onClose}
            className="bg-richblack-700 text-richblack-50 px-4 py-2 rounded-md hover:bg-richblack-600"
          >
            Close Quiz
          </button>
        </div>

        {/* Quiz Edit Modal */}
        {showEditModal && (
          <QuizEditModal
            quiz={quiz}
            onClose={() => setShowEditModal(false)}
            onQuizUpdate={(updatedQuiz) => {
              // Handle quiz update logic
              setShowEditModal(false)
              // You might want to refresh the quiz data here
            }}
          />
        )}
      </div>
    )
  }

  const currentQuestionData = quiz.questions[currentQuestion]

  // Add error handling for invalid question data
  if (!currentQuestionData || !currentQuestionData.options || !Array.isArray(currentQuestionData.options)) {
    return (
      <div className="p-6 bg-richblack-800 rounded-lg">
        <p className="text-xl text-richblack-5">Error: Question data is invalid</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-richblack-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-richblack-5">{quiz.title}</h2>
        {isQuizCreator && (
          <button
            onClick={handleEditQuiz}
            className="flex items-center gap-2 bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-100"
          >
            <HiPencil className="text-lg" />
            Edit Quiz
          </button>
        )}
      </div>
      
      {previousAttempts && previousAttempts.length > 0 && (
        <div className="mb-4 p-3 bg-richblack-700 rounded-lg">
          <p className="text-richblack-50">
            Best Score: {Math.max(...previousAttempts.map(a => a.score))}/{quiz.questions.length}
          </p>
          <p className="text-richblack-50 text-sm">
            Last Attempt: {new Date(previousAttempts[0].completedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-richblack-300 mb-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
        <div className="h-2 bg-richblack-700 rounded-full">
          <div
            className="h-full bg-yellow-50 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl text-richblack-50 mb-4">
          {currentQuestionData.question}
        </h3>
        {currentQuestionData.imageUrl && (
          <img
            src={currentQuestionData.imageUrl}
            alt="Question"
            className="max-h-60 rounded-lg mb-4"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(currentQuestion, index)}
              className={`p-4 rounded-lg text-left ${
                selectedAnswers[currentQuestion] === index
                  ? "bg-yellow-50 text-richblack-800"
                  : "bg-richblack-700 text-richblack-50"
              } hover:bg-yellow-50 hover:text-richblack-800 transition-all duration-200`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? "bg-richblack-700 text-richblack-300 cursor-not-allowed"
              : "bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
          }`}
        >
          Previous
        </button>
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-100"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-100"
          >
            Next
          </button>
        )}
      </div>

      {/* Quiz Edit Modal */}
      {showEditModal && (
        <QuizEditModal
          quiz={quiz}
          onClose={() => setShowEditModal(false)}
          onQuizUpdate={(updatedQuiz) => {
            // Handle quiz update logic
            setShowEditModal(false)
            // You might want to refresh the quiz data here
          }}
        />
      )}
    </div>
  )
}