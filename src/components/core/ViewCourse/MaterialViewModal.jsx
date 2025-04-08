import { RxCross2 } from "react-icons/rx"
import { FiDownload } from "react-icons/fi"
import { useState } from "react"

export default function MaterialViewModal({ material, setViewMaterial }) {
  const [viewerError, setViewerError] = useState(false)

  // Function to get Google Docs Viewer URL
  const getViewerUrl = (fileUrl) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
  }

  // Function to handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(material.fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = material.title + (material.fileType.includes('pdf') ? '.pdf' : '.pptx')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
      <div className="my-10 w-11/12 max-w-[900px] rounded-lg border border-richblack-400 bg-richblack-800/90">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {material.title}
          </p>
          <div className="flex items-center gap-x-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-yellow-50 hover:text-yellow-100"
            >
              <FiDownload className="text-lg" />
              Download
            </button>
            <button onClick={() => setViewMaterial(null)}>
              <RxCross2 className="text-2xl text-richblack-5" />
            </button>
          </div>
        </div>
        
        {/* Material Content */}
        <div className="p-6">
          <div className="h-[70vh] w-full bg-richblack-900 rounded-lg overflow-hidden">
            {!viewerError ? (
              <iframe
                src={getViewerUrl(material.fileUrl)}
                title={material.title}
                className="w-full h-full border-0"
                onError={() => setViewerError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-richblack-5 text-center p-4">
                  Unable to load document preview. <br />
                  Please <button onClick={handleDownload} className="text-yellow-50 hover:underline">download</button> to view.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 