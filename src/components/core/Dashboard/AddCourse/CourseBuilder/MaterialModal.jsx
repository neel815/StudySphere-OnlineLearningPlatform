import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { addCourseMaterial } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import DocumentUpload from "../DocumentUpload"

export default function MaterialModal({ modalData, setModalData }) {
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

  // Watch for file changes
  const materialFile = watch("materialFile")

  useEffect(() => {
    if (modalData) {
      setValue("materialTitle", "")
      setValue("materialFile", null)
    }
  }, [modalData, setValue])

  const onSubmit = async (data) => {
    // Validate required fields
    if (!data.materialTitle?.trim()) {
      toast.error("Please enter a material title")
      return
    }
    if (!data.materialFile) {
      toast.error("Please upload a material file")
      return
    }
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("sectionId", modalData)
      formData.append("materialTitle", data.materialTitle.trim())
      formData.append("materialFile", data.materialFile)
      
      console.log("Uploading material:", {
        sectionId: modalData,
        title: data.materialTitle,
        fileName: data.materialFile.name
      })

      const result = await addCourseMaterial(formData, token)
      if (result) {
        // Update course structure
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData
            ? {
                ...section,
                materials: [...(section.materials || []), result],
              }
            : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
        toast.success("Material added successfully")
        setModalData(null)
      }
    } catch (error) {
      console.error("Error uploading material:", error)
      toast.error(error.message || "Failed to upload material")
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
            Add Course Material
          </p>
          <button onClick={() => setModalData(null)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
          encType="multipart/form-data"
        >
          {/* Material Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="materialTitle">
              Material Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="materialTitle"
              placeholder="Enter material title"
              {...register("materialTitle", { required: true })}
              className="form-style w-full !bg-richblack-700/75"
            />
            {errors.materialTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Material title is required
              </span>
            )}
          </div>

          {/* Material File */}
          <DocumentUpload
            name="materialFile"
            label="Material PDF/PPT"
            register={register}
            setValue={setValue}
            errors={errors}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => setModalData(null)}
              className="rounded-md bg-richblack-700/75 px-4 py-2 text-richblack-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-yellow-50 px-4 py-2 text-black font-semibold"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}