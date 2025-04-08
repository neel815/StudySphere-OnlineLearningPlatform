import React, { useEffect, useState } from "react"
import { Player, BigPlayButton } from "video-react"
import { apiConnector } from "../../../services/apiconnector"
import { courseEndpoints } from "../../../services/apis"
import { toast } from "react-hot-toast"

const PreviewLectureModal = ({ courseId, onClose }) => {
  const [previewLecture, setPreviewLecture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPreviewLecture = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!courseId) {
          throw new Error("Course ID is required")
        }

        const response = await apiConnector("POST", courseEndpoints.GET_PREVIEW_LECTURE_API, {
          courseId,
        })
        
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to load preview lecture")
        }
        
        if (!response.data.data?.lecture) {
          throw new Error("No preview lecture found")
        }
        
        setPreviewLecture(response.data.data)
      } catch (error) {
        console.error("Error fetching preview lecture:", error)
        setError(error.message || "Failed to load preview lecture")
        toast.error(error.message || "Failed to load preview lecture")
      } finally {
        setLoading(false)
      }
    }

    fetchPreviewLecture()
  }, [courseId])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
        <div className="relative w-11/12 max-w-[900px] rounded-lg bg-richblack-800 p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-richblack-5 hover:text-yellow-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="text-center text-richblack-5">
            <p className="text-xl font-semibold">Error Loading Preview</p>
            <p className="mt-2 text-richblack-200">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!previewLecture) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
      <div className="relative w-11/12 max-w-[900px] rounded-lg bg-richblack-800 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-richblack-5 hover:text-yellow-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-richblack-5">
            {previewLecture.lecture.title}
          </h2>
          <p className="mt-2 text-richblack-200">
            {previewLecture.lecture.description}
          </p>
        </div>

        <div className="aspect-video w-full">
          <Player
            src={previewLecture.lecture.videoUrl}
            fluid={false}
            width="100%"
            height="100%"
          >
            <BigPlayButton position="center" />
          </Player>
        </div>
      </div>
    </div>
  )
}

export default PreviewLectureModal 