import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 space-y-6">
      <div>
        <label className="text-sm text-[#8f9095] mb-1 block">
          Email <sup className="text-pink-200">*</sup>
        </label>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="w-full bg-[#242424] text-white px-3 py-2 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#4b9cff] placeholder:text-[#8f9095]"
        />
      </div>

      <div className="relative">
        <label className="text-sm text-[#8f9095] mb-1 block">
          Password <sup className="text-pink-200">*</sup>
        </label>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="w-full bg-[#242424] text-white px-3 py-2 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#4b9cff] placeholder:text-[#8f9095]"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[34px] cursor-pointer text-[#8f9095]"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      <Link
        to="/forgot-password"
        className="block text-right text-[#4b9cff] hover:text-blue-400 text-sm font-medium"
      >
        Forgot Password?
      </Link>

      <button
        type="submit"
        className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-grey transition-colors"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm 