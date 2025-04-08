import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"
import { getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import { setCompletedLectures } from "../../../slices/viewCourseSlice"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses")
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        if (filteredData.length > 0) {
          const filteredVideoData = filteredData?.[0]?.subSection.filter(
            (data) => data._id === subSectionId
          )
          setVideoData(filteredVideoData[0])
          setPreviewSource(courseEntireData.thumbnail)
        }
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true
    }
    return false
  }

  // go to the next video
  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndex !== noOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1]?.subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true
    }
    return false
  }

  // go to the previous video
  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1]?.subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1]?.subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    try {
      console.log("Marking lecture as complete with:", {
        courseID: courseId,
        subsectionId: subSectionId,
      })
      
      const res = await markLectureAsComplete(
        {
          courseID: courseId,
          subsectionId: subSectionId,
        },
        token
      )
      
      console.log("Mark lecture response:", res)
      
      // Check if the API call was successful
      if (res && res.success) {
        // Update the completed lectures in Redux
        dispatch(updateCompletedLectures(subSectionId))
        
        // Refresh the course progress
        const updatedCourseData = await getFullDetailsOfCourse(courseId, token)
        console.log("Updated course data:", updatedCourseData)
        
        if (updatedCourseData) {
          dispatch(setCompletedLectures(updatedCourseData.completedVideos))
        }
      } else {
        throw new Error(res?.error || "Failed to mark lecture as complete")
      }
    } catch (error) {
      console.error("Error in handleLectureCompletion:", error)
      toast.error(error.message || "Failed to mark lecture as complete")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <>
          {/* Video Player */}
          <div className="flex flex-col gap-5">
            <div className="border border-richblack-700 rounded-lg">
              <Player
                ref={playerRef}
                aspectRatio="16:9"
                playsInline
                onEnded={() => setVideoEnded(true)}
                src={videoData?.videoUrl}
              >
                <BigPlayButton position="center" />
              </Player>
            </div>

            {/* Video Description */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-richblack-5">{videoData?.title}</h1>
              <p className="text-sm text-richblack-200">{videoData?.description}</p>
            </div>

            {/* Simulation Section */}
            {videoData?.simulationLink && videoData.simulationLink.trim() !== "" && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-richblack-5">Interactive Simulation Lab</h2>
                  <span className="text-xs text-yellow-50 bg-richblack-700 px-2 py-1 rounded-full">Beta</span>
                </div>
                
                {/* Instructions Panel */}
                <div className="bg-richblack-700 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-semibold text-yellow-50 mb-2">📝 Tips for Best Experience:</h3>
                  <ul className="text-xs text-richblack-100 list-disc list-inside space-y-1">
                    <li>Use full screen mode for better interaction</li>
                    <li>Allow any browser permissions if requested</li>
                    <li>If simulation doesn't load, try the "Open in New Tab" option</li>
                  </ul>
                </div>

                {/* Simulation Viewer */}
                <div className="w-full bg-richblack-900 rounded-lg overflow-hidden border-2 border-yellow-50">
                  <div className="relative" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      src={videoData.simulationLink}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-richblack-300">
                    Having trouble? Try opening the simulation in a new tab
                  </p>
                  <button
                    onClick={() => window.open(videoData.simulationLink, '_blank')}
                    className="flex items-center gap-2 text-sm text-yellow-50 hover:text-yellow-100"
                  >
                    Open in New Tab
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Render When Video Ends */}
          {videoEnded && (
            <div className="mt-4 flex min-w-[250px] justify-end gap-x-4">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark as Completed" : "Loading..."}
                />
              )}
              {!isLastVideo() && (
                <IconBtn
                  disabled={loading}
                  onclick={() => goToNextVideo()}
                  text="Next"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VideoDetails
// video