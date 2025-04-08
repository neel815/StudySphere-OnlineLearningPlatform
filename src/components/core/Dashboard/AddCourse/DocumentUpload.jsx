import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { HiDocumentText } from "react-icons/hi"
import { toast } from "react-hot-toast"

export default function DocumentUpload({
  name,
  label,
  register,
  setValue,
  errors,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )

  const handleFileSelect = (file) => {
    if (!file) return

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 10MB")
      return
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid PDF, PPT, or PPTX file")
      return
    }

    setSelectedFile(file)
    setPreviewSource(file.name)
    // Set the actual file object for form submission
    setValue(name, file)
  }

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      handleFileSelect(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop
  })

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 hover:bg-richblack-600 transition-all duration-200`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col items-center p-6">
            <div className="flex items-center justify-center gap-2 rounded-lg bg-richblack-800 p-4">
              <HiDocumentText className="text-4xl text-yellow-50" />
              <span className="text-richblack-200">{previewSource}</span>
            </div>
            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering dropzone click
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 hover:text-richblack-300 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <input {...getInputProps()} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop a PDF or PPT file, or click anywhere to select
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Max file size: 10MB</li>
              <li>PDF, PPT, PPTX only</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}