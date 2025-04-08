// Icons Import
import { FaArrowRight, FaUsers, FaGraduationCap, FaCertificate, FaStar, FaCode, FaLaptopCode, FaChalkboardTeacher } from "react-icons/fa"
import { Link } from "react-router-dom"
import Tilt from 'react-parallax-tilt'
import { motion } from "framer-motion"

// Image and Video Import
import Banner from "../assets/Images/banner.mp4"
// Component Imports
import Footer from "../components/common/Footer"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import img from "../assets/Images/WhyUs.png"
import img2 from "../assets/Images/Teacher.png"
import joinnow from "../assets/Images/joinnow.jpg"
import ReviewSlider from "../components/common/ReviewSlider"
import img1 from "../assets/Images/coding.png"
import Recommendation from "../components/Recommendation"

function Home() {
  return (
    <div className="bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOC0zLjU4MiA4IDggMy41ODIgOCA4IDh6IiBzdHJva2U9IiMxYzFjMWMiIHN0cm9rZS1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      {/* Hero Section */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-2 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="text-blue-400 text-lg font-semibold tracking-wider font-['Poppins']">WELCOME TO STUDYSPHERE</div>
          <div className="text-6xl font-bold leading-tight mt-4 flex flex-col font-['Montserrat']">
            <span className="font-light">Transform Your</span>
            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent relative font-bold">
              Learning Journey
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
            </span>
          </div>
          <div className="w-[90%] mx-auto text-center text-xl text-gray-300 mt-6 font-['Inter'] font-light leading-relaxed">
            Master new skills with expert-led courses, hands-on projects, and personalized learning paths
          </div>
        </motion.div>

        {/* Video Section with Enhanced Styling */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-3 my-12 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] transform hover:scale-105 transition-all duration-300 relative group w-full max-w-7xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <video
            className="w-full h-auto max-h-[800px] object-cover"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </motion.div>

        
        {/* Featured Courses Section */}
        <div className="w-full py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-400">Discover our most popular courses</p> */}
          </motion.div>
          <Recommendation/>
        </div>

    

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-16">
          {[
            { icon: <FaUsers className="text-4xl text-blue-400 mx-auto mb-4" />, number: "10,000+", text: "Active Students" },
            { icon: <FaGraduationCap className="text-4xl text-blue-400 mx-auto mb-4" />, number: "500+", text: "Courses Available" },
            { icon: <FaCertificate className="text-4xl text-blue-400 mx-auto mb-4" />, number: "95%", text: "Success Rate" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#1C1C1C] to-[#0C0C0C] p-8 rounded-xl text-center border border-blue-500/20 hover:border-blue-500/40 transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {stat.icon}
                <div className="text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-gray-400">{stat.text}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Compiler Section */}
        <Tilt
          className="w-full"
          tiltMaxAngleX={3}
          tiltMaxAngleY={3}
          scale={1.02}
          transitionSpeed={2000}
          gyroscope={true}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-10 px-8 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-gradient-to-r from-black to-[#0C0C0C] group border border-blue-500/20 hover:border-blue-500/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Left Content */}
            <div className="lg:w-1/2 relative z-10">
              <div className="text-blue-400 font-semibold text-lg">Quick Compiler</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
                Code On-the-Go with
                <br />
                Quick Compiler
              </h2>
              <p className="text-[#686868] text-base lg:text-lg mb-8 max-w-[90%]">
                Whether you're fine-tuning your code or exploring
                new languages, Quick Compiler simplifies the coding
                process, making it faster and more accessible for
                every developer.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Try it Yourself</span>
              </motion.button>
            </div>

            {/* Right Content - Code Editor */}
            <div className="lg:w-1/2 relative z-10">
              <div className="bg-[#1C1C1C] rounded-lg p-4 shadow-xl relative overflow-hidden border border-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="font-mono text-sm">
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">1</span>
                      <span className="text-blue-400">&lt;!DOCTYPE html&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">2</span>
                      <span className="text-blue-400">&lt;html&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">3</span>
                      <span className="text-blue-400">&lt;head&gt;&lt;title&gt;Example&lt;/title&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">4</span>
                      <span className="text-blue-400">&lt;link</span>
                      <span className="text-blue-400"> rel="stylesheet" href="styles.css"&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">5</span>
                      <span className="text-blue-400">&lt;/head&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">6</span>
                      <span className="text-blue-400">&lt;body&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">7</span>
                      <span className="text-blue-400">&lt;h1&gt;&lt;a href="/"&gt;Header&lt;/a&gt;&lt;/h1&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">8</span>
                      <span className="text-blue-400">&lt;h1&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">9</span>
                      <span className="text-blue-400">&lt;nav&gt;&lt;a href="one/"&gt;One&lt;/a&gt;&lt;a href="two/"&gt;Two&lt;/a&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">10</span>
                      <span className="text-blue-400">&lt;a href="three/"&gt;Three&lt;/a&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">11</span>
                      <span className="text-blue-400">&lt;/nav&gt;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 inline-block text-[#686868]">12</span>
                      <span className="w-1 h-5 bg-blue-400 animate-blink"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tilt>

        {/* Why Choose Us Section */}
        <div className="lg:flex lg:flex-row items-center gap-8 mt-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="lg:w-3/5 transform transition-transform duration-300"
          >
            <img src={img} alt="Learning" className="w-full h-[800px] object-contain rounded-xl shadow-xl border border-blue-500/20" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-2/5"
          >
            <div className="text-4xl font-semibold mb-8">
              <h2 className="text-[#00ffff] font-['Montserrat'] text-5xl font-bold mb-2">Why Choose Us?</h2>
            </div>
            <div className="space-y-6">
              {[
                { icon: <FaLaptopCode className="text-blue-400 text-2xl" />, title: "Hands-on Learning", desc: "Practical projects and real-world applications" },
                { icon: <FaChalkboardTeacher className="text-blue-400 text-2xl" />, title: "Expert Instructors", desc: "Learn from industry professionals" },
                { icon: <FaCode className="text-blue-400 text-2xl" />, title: "Interactive Learning", desc: "Engaging content and community support" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="bg-[#001a1a] p-4 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white font-['Poppins']">{feature.title}</h3>
                    <p className="text-gray-400 text-lg">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-row gap-7 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#00ffff] to-blue-400 text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity text-lg"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#00ffff] text-[#00ffff] px-8 py-3 rounded-full font-medium hover:bg-[#00ffff]/10 transition-colors text-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 mt-16">
          <TimelineSection />
        </div>

        {/* Become Instructor Section */}
        <div className="lg:flex lg:flex-row items-stretch gap-8 mt-16 w-11/12 max-w-maxContent mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2 bg-[#0C0C0C] p-8 rounded-xl border border-blue-500/20"
          >
            <div className="text-4xl font-semibold mb-6">
              <h2 className="text-[#00ffff] font-['Montserrat'] text-5xl font-bold">Become an Instructor</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">
              Share your knowledge with millions of students worldwide. We provide the tools and support you need to create engaging courses.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Create and sell your courses",
                "Reach students worldwide",
                "Earn while you teach"
              ].map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00ffff] group-hover:scale-150 transition-transform"></div>
                  <span className="text-white group-hover:text-[#00ffff] transition-colors">{point}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#00ffff] to-blue-400 text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity text-lg"
            >
              Start Teaching Today
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="lg:w-1/2 transform transition-transform duration-300"
          >
            <img src={img2} alt="Instructor" className="w-full h-full object-cover rounded-xl shadow-xl border border-blue-500/20" />
          </motion.div>
        </div>

        {/* Join Now Section */}
        <div className="lg:flex lg:flex-row items-stretch mt-16 w-11/12 max-w-maxContent mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500 to-blue-400 w-2/5 h-[450px] flex flex-col justify-center items-start text-white p-8 pl-10 rounded-l-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-lg mb-6">
                Join thousands of students who are already learning and growing with us.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-500 px-6 py-2 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-3/5 h-[450px] flex rounded-r-xl overflow-hidden"
          >
            <img src={joinnow} alt="Join Now" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="items-center justify-center flex flex-col w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h1 className="text-center text-4xl text-white mb-4">What Our Students Say</h1>
            <p className="text-gray-400">Join thousands of satisfied students</p>
          </motion.div>
          <ReviewSlider />
        </div>

        <Footer/>
      </div>
    </div>
  )
}

export default Home;