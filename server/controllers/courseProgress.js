const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseID, subsectionId } = req.body
  const userId = req.user.id

  console.log("Received request body:", req.body)
  console.log("User ID:", userId)

  try {
    // Check if all required fields are present
    if (!courseID || !subsectionId) {
      console.log("Missing fields - courseID:", courseID, "subsectionId:", subsectionId)
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      console.log("Invalid subsection ID:", subsectionId)
      return res.status(404).json({
        success: false,
        message: "Invalid subsection"
      })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseID,
      userId: userId,
    })

    console.log("Found course progress:", courseProgress)

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      courseProgress = await CourseProgress.create({
        courseID: courseID,
        userId: userId,
        completedVideos: [subsectionId],
      })
      console.log("Created new course progress:", courseProgress)
      return res.status(200).json({
        success: true,
        message: "Course progress created successfully"
      })
    }

    // If course progress exists, check if the subsection is already completed
    if (courseProgress.completedVideos.includes(subsectionId)) {
      console.log("Subsection already completed")
      return res.status(200).json({
        success: true,
        message: "Subsection already completed"
      })
    }

    // Push the subsection into the completedVideos array
    courseProgress.completedVideos.push(subsectionId)

    // Save the updated course progress
    await courseProgress.save()
    console.log("Updated course progress:", courseProgress)

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully"
    })
  } catch (error) {
    console.error("Error in updateCourseProgress:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update course progress",
      error: error.message
    })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }