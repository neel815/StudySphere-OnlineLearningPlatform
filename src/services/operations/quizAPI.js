import { apiConnector } from "../apiconnector"
import { quizEndpoints } from "../apis"
import { toast } from "react-hot-toast"

export const submitQuizAttempt = async (data) => {
  const { quizId, score, answers, token } = data
  
  try {
    // Validate required data
    if (!quizId) throw new Error('Quiz ID is required')
    if (score === undefined) throw new Error('Score is required')
    if (!answers || !Array.isArray(answers)) throw new Error('Valid answers array is required')
    if (!token) throw new Error('Authentication token is required')

    console.log('Making API request to:', quizEndpoints.SUBMIT_QUIZ_ATTEMPT_API)
    console.log('With data:', {
      quizId,
      score,
      answersCount: answers.length,
      token: token ? 'Present' : 'Missing'
    })
    
    const response = await apiConnector(
      "POST",
      quizEndpoints.SUBMIT_QUIZ_ATTEMPT_API,
      {
        quizId,
        score,
        answers
      },
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    )

    console.log('API Response:', {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
    })

    if (!response?.data) {
      throw new Error("No data received from server")
    }

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to submit quiz")
    }

    return response.data
  } catch (error) {
    console.log("SUBMIT_QUIZ_ATTEMPT_API API ERROR:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })
    
    // Throw a more informative error
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export const getQuizAttempts = async (quizId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${quizEndpoints.GET_QUIZ_ATTEMPTS_API}/${quizId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.attempts) {
      throw new Error("No attempts data received from server")
    }

    return response.data.attempts
  } catch (error) {
    console.log("GET_QUIZ_ATTEMPTS_API API ERROR:", error)
    throw error.response?.data || error
  }
}

export const updateQuiz = async (formData, token) => {
  const toastId = toast.loading("Updating quiz...")
  try {
    console.log('Making update quiz request...')

    const response = await apiConnector(
      "PUT",
      quizEndpoints.UPDATE_QUIZ_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    )

    console.log('Update quiz response:', {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data
    })

    if (!response?.data) {
      throw new Error("No data received from server")
    }

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update quiz")
    }

    toast.success("Quiz updated successfully")
    return response.data
  } catch (error) {
    console.error("UPDATE_QUIZ_API ERROR:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    })
    
    let errorMessage = "Failed to update quiz"
    
    if (error.message === "Network Error") {
      errorMessage = "Network error - Please check your connection and try again"
    } else if (error.response?.status === 500) {
      errorMessage = "Server error occurred. Please try again later."
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    toast.error(errorMessage)
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

export const createQuiz = async (formData, token) => {
  const toastId = toast.loading("Creating quiz...")
  try {
    console.log('Making create quiz request...')
    
    const response = await apiConnector(
      "POST",
      quizEndpoints.CREATE_QUIZ_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    )

    console.log('Create quiz response:', {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data
    })

    if (!response?.data) {
      throw new Error("No data received from server")
    }

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create quiz")
    }

    toast.success("Quiz created successfully")
    return response.data
  } catch (error) {
    console.error("CREATE_QUIZ_API ERROR:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    })
    
    let errorMessage = "Failed to create quiz"
    
    if (error.message === "Network Error") {
      errorMessage = "Network error - Please check your connection and try again"
    } else if (error.response?.status === 500) {
      errorMessage = "Server error occurred. Please try again later."
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    toast.error(errorMessage)
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}