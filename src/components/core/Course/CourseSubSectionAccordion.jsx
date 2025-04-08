import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import PreviewLectureModal from "./PreviewLectureModal"

export default function CourseSubSectionAccordion({ subSec, isFirstLecture, courseId }) {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const handleLectureClick = () => {
    if (isFirstLecture) {
      setShowPreviewModal(true)
    } else if (!token) {
      navigate("/login")
    } else {
      // Handle normal lecture access
      // ... existing code ...
    }
  }

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between py-2"
        onClick={handleLectureClick}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="text-richblack-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </i>
          </span>
          <p>{subSec?.title}</p>
        </div>
        {isFirstLecture && (
          <span className="text-xs text-yellow-50 bg-yellow-900/20 px-2 py-1 rounded-full">
            Preview
          </span>
        )}
      </div>
      {showPreviewModal && (
        <PreviewLectureModal
          courseId={courseId}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </>
  )
}