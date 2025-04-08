import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { HiDocumentText } from "react-icons/hi"
import { BsQuestionCircle } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteSection,
  deleteSubSection,
  deleteMaterial,
  deleteQuiz,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"
import MaterialModal from "./MaterialModal"
import QuizModal from "./QuizModal"
import QuizEditModal from "../../../ViewCourse/QuizEditModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [addMaterial, setAddMaterial] = useState(null)
  const [addQuiz, setAddQuiz] = useState(null)
  const [editQuiz, setEditQuiz] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  const handleDeleteMaterial = async (materialId, sectionId) => {
    const result = await deleteMaterial({ materialId, sectionId, token })
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  const handleDeleteQuiz = async (quizId, sectionId) => {
    const result = await deleteQuiz({ quizId, sectionId, token })
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section) => (
          // Section Dropdown
          <details key={section._id} open>
            {/* Section Dropdown Content */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures and materials in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {/* Render All Sub Sections Within a Section */}
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Render All Materials */}
              {section.materials?.map((material) => (
                <div
                  key={material?._id}
                  className="flex items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <HiDocumentText className="text-2xl text-yellow-50" />
                    <p className="font-semibold text-richblack-50">
                      {material.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Material?",
                          text2: "This material will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteMaterial(material._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Render All Quizzes */}
              {section.quizzes?.map((quiz) => (
                <div
                  key={quiz?._id}
                  className="flex items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <BsQuestionCircle className="text-2xl text-yellow-50" />
                    <p className="font-semibold text-richblack-50">
                      {quiz.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() => setEditQuiz(quiz)}
                      className="text-richblack-300 hover:text-yellow-50"
                    >
                      <MdEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Quiz?",
                          text2: "This quiz will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteQuiz(quiz._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Buttons */}
              <div className="mt-3 flex items-center gap-x-3">
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="flex items-center gap-x-1 text-yellow-50"
                >
                  <FaPlus className="text-lg" />
                  <p>Add Lecture</p>
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <button
                  onClick={() => setAddMaterial(section._id)}
                  className="flex items-center gap-x-1 text-yellow-50"
                >
                  <FaPlus className="text-lg" />
                  <p>Add Material</p>
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <button
                  onClick={() => setAddQuiz(section._id)}
                  className="flex items-center gap-x-1 text-yellow-50"
                >
                  <FaPlus className="text-lg" />
                  <p>Add Quiz</p>
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : addMaterial ? (
        <MaterialModal
          modalData={addMaterial}
          setModalData={setAddMaterial}
        />
      ) : addQuiz ? (
        <QuizModal
          modalData={addQuiz}
          setModalData={setAddQuiz}
        />
      ) : editQuiz ? (
        <QuizEditModal
          quiz={editQuiz}
          onClose={() => setEditQuiz(null)}
          onQuizUpdate={(updatedQuiz) => {
            // Update the course with the updated quiz
            const updatedCourseContent = course.courseContent.map((section) => ({
              ...section,
              quizzes: section.quizzes?.map((q) =>
                q._id === updatedQuiz._id ? updatedQuiz : q
              ),
            }))
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            setEditQuiz(null)
          }}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}