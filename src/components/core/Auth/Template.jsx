import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { BiTime } from "react-icons/bi"
import { HiOutlineUserGroup } from "react-icons/hi"
import { RiShieldLine } from "react-icons/ri"
import { MdOutlineBrush } from "react-icons/md"

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-center gap-20 px-8 md:px-16">
          {/* Left Section - Content */}
          <div className="w-full md:w-[500px] flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4">Welcome to StudySphere</h2>
                <p className="text-[#8f9095] text-lg">Empower your future with our online courses</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#4b9cff] transition-colors">
                  <BiTime className="text-[#4b9cff] text-2xl mt-1" />
                  <div>
                    <h3 className="text-white text-lg font-medium">Learn at Your Own Pace</h3>
                    <p className="text-[#8f9095]">Access courses anytime, anywhere. Study according to your schedule with lifetime access to content.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#4b9cff] transition-colors">
                  <HiOutlineUserGroup className="text-[#4b9cff] text-2xl mt-1" />
                  <div>
                    <h3 className="text-white text-lg font-medium">Expert Instructors</h3>
                    <p className="text-[#8f9095]">Learn from industry experts who have hands-on experience in design, development, and innovation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#4b9cff] transition-colors">
                  <RiShieldLine className="text-[#4b9cff] text-2xl mt-1" />
                  <div>
                    <h3 className="text-white text-lg font-medium">Structured Learning</h3>
                    <p className="text-[#8f9095]">Follow a proven curriculum designed to help you master skills with practical projects and assignments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#4b9cff] transition-colors">
                  <MdOutlineBrush className="text-[#4b9cff] text-2xl mt-1" />
                  <div>
                    <h3 className="text-white text-lg font-medium">Job-Ready Skills</h3>
                    <p className="text-[#8f9095]">Build a portfolio of real projects and earn certificates that showcase your job-ready skills.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-[500px]">
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
              <div className="mb-8">
                <h1 className="text-white text-2xl font-semibold mb-2">Create your account</h1>
                <p className="text-[#8f9095]">
                  Welcome! Please fill in the details to get started.
                </p>
              </div>
              
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
              
              <div className="mt-6 text-center">
                <p className="text-[#8f9095]">
                  {formType === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                  <Link to={formType === "signup" ? "/login" : "/signup"} className="text-[#4b9cff] hover:text-blue-400 font-medium">
                    {formType === "signup" ? "Sign in" : "Sign up"}
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                <p className="text-center text-sm text-[#8f9095]">
                  Secured by StudySphere
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Template