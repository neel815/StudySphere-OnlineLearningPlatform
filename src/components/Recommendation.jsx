import React, { useEffect, useState } from "react";
import { getCourses } from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses(); 
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  }; 

  return (
    <div className="w-full py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Recommended Courses</h2>
        <p className="text-gray-400">Discover our most popular courses</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
        {courses.slice(0, 3).map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCourseClick(course._id)}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-blue-500/20 hover:border-blue-500/40 relative group cursor-pointer"
          >
            {/* Course Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {course.courseName || "Untitled Course"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {course.courseDescription || "No description available."}
              </p>

              {/* Price and Enroll Button */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {course.price ? `₹${course.price}` : "Free"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Enroll Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
