import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-lg">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800/90 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <button
            className="cursor-pointer rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900"
            onClick={modalData?.btn1Handler}
          >
            {modalData?.btn1Text}
          </button>
          <button
            className="cursor-pointer rounded-md bg-richblack-700/50 py-[8px] px-[20px] font-semibold text-richblack-5"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}