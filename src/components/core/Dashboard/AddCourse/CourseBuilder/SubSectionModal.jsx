import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import SimulationSelector from "../../../AddCourse/SimulationSelector"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [showSimulationPreview, setShowSimulationPreview] = useState(false)
  const [isSimulationSelectorOpen, setIsSimulationSelectorOpen] = useState(false)

  // Watch for simulation link changes
  const simulationLink = watch("simulationLink")

  useEffect(() => {
    if (view || edit) {
      console.log("Modal Data for Edit/View:", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
      setValue("simulationLink", modalData.simulationLink || "")
    }
  }, [])

  // Handle simulation link preview
  useEffect(() => {
    if (simulationLink && simulationLink.trim() !== "") {
      setShowSimulationPreview(true)
    } else {
      setShowSimulationPreview(false)
    }
  }, [simulationLink])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    console.log("Current Form Values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl ||
      currentValues.simulationLink !== modalData.simulationLink
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    const formData = new FormData()
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    // Always include simulationLink in edit
    formData.append("simulationLink", currentValues.simulationLink || "")
    
    // Add debug logging for edit
    console.log("Edit Form Data being sent:", {
      sectionId: modalData.sectionId,
      subSectionId: modalData._id,
      title: currentValues.lectureTitle,
      description: currentValues.lectureDesc,
      video: currentValues.lectureVideo,
      simulationLink: currentValues.simulationLink
    })
    
    // Log the actual FormData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }
    
    setLoading(true)
    const result = await updateSubSection(formData, token)
    console.log("Update SubSection Response:", result)
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    // Always include simulationLink in create
    formData.append("simulationLink", data.simulationLink || "")
    
    // Add debug logging
    console.log("Form Data being sent:", {
      sectionId: modalData,
      title: data.lectureTitle,
      description: data.lectureDesc,
      video: data.lectureVideo,
      simulationLink: data.simulationLink
    })
    
    // Log the actual FormData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }
    
    setLoading(true)
    const result = await createSubSection(formData, token)
    console.log("Create SubSection Response:", result)
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const handleSimulationSelect = (iframeSrc) => {
    setValue("simulationLink", iframeSrc)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800/90">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {/* Simulation Link */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="simulationLink">
              Simulation Link
            </label>
            <div className="flex">
              <input
                disabled={view || loading}
                id="simulationLink"
                placeholder="Enter Simulation iframe Link (optional)"
                {...register("simulationLink")}
                className="form-style w-full"
              />
              {!view && (
                <button
                  type="button"
                  onClick={() => setIsSimulationSelectorOpen(true)}
                  className="flex-shrink-0 ml-2 px-4 py-2 text-sm font-medium bg-richblack-700 text-richblack-50 hover:bg-richblack-600 rounded-md transition-all duration-200"
                >
                  Browse
                </button>
              )}
            </div>
            <p className="text-xs text-richblack-400">
              Add an interactive simulation iframe link from sources like PhET, etc.
            </p>
            <p className="text-xs text-richblack-400">
              Example: https://phet.colorado.edu/sims/html/buoyancy-basics/latest/buoyancy-basics_en.html
            </p>
          </div>
          
          {/* Preview Simulation if link is added in add/edit mode */}
          {!view && showSimulationPreview && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-richblack-5">Simulation Preview</label>
              <div className="w-full bg-richblack-900 rounded-lg overflow-hidden border-2 border-yellow-50">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={simulationLink}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
              <p className="text-xs text-yellow-50">
                ⓘ Preview the simulation above. If not visible, check the link format.
              </p>
            </div>
          )}

          {/* Modal Buttons */}
          {!view && (
            <div className="flex justify-end gap-x-2">
              <button
                disabled={loading}
                onClick={() => (!loading ? setModalData(null) : {})}
                className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-semibold text-richblack-50"
              >
                Cancel
              </button>
              <IconBtn disabled={loading} text={loading ? "Loading.." : edit ? "Save Changes" : "Save"} />
            </div>
          )}
        </form>
      </div>

      {/* Simulation Selector Modal */}
      <SimulationSelector
        isOpen={isSimulationSelectorOpen}
        onClose={() => setIsSimulationSelectorOpen(false)}
        onSelect={handleSimulationSelect}
      />
    </div>
  )
}