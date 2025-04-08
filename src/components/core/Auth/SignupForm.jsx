import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Set default accountType to Instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.INSTRUCTOR)
  const [userType, setUserType] = useState("Student")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    const signupData = {
      ...formData,
      accountType,
      userType,
    }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.INSTRUCTOR)
    setUserType("Student")
  }

  // data to pass to Tab component for userType selection
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: "Student",
    },
    {
      id: 2,
      tabName: "Instructor",
      type: "Instructor",
    },
  ]

  return (
    <div className="bg-black p-6 rounded-xl">
      {/* Tab for userType selection */}
      <Tab tabData={tabData} field={userType} setField={setUserType} />
      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-6">
        <div className="flex gap-x-6">
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-300 font-semibold">
              First Name <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-lg bg-black p-3 text-white border-2 border-gray-800 
                focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 
                transition-all duration-200 placeholder:text-gray-500"
            />
          </label>
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-300 font-semibold">
              Last Name <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-lg bg-black p-3 text-white border-2 border-gray-800 
                focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 
                transition-all duration-200 placeholder:text-gray-500"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-300 font-semibold">
            Email Address <sup className="text-red-500">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-lg bg-black p-3 text-white border-2 border-gray-800 
              focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 
              transition-all duration-200 placeholder:text-gray-500"
          />
        </label>
        <div className="flex gap-x-6">
          <label className="relative w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-300 font-semibold">
              Create Password <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-lg bg-black p-3 pr-10 text-white border-2 border-gray-800 
                focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 
                transition-all duration-200 placeholder:text-gray-500"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} className="text-gray-400 hover:text-gray-300" />
              ) : (
                <AiOutlineEye fontSize={24} className="text-gray-400 hover:text-gray-300" />
              )}
            </span>
          </label>
          <label className="relative w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-300 font-semibold">
              Confirm Password <sup className="text-red-500">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-lg bg-black p-3 pr-10 text-white border-2 border-gray-800 
                focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 
                transition-all duration-200 placeholder:text-gray-500"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} className="text-gray-400 hover:text-gray-300" />
              ) : (
                <AiOutlineEye fontSize={24} className="text-gray-400 hover:text-gray-300" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-lg bg-yellow-500 hover:bg-yellow-600 py-3 px-4 font-semibold text-black w-full 
            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-yellow-500/25"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm