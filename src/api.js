import axios from "axios";

// Backend server URL
const API = axios.create({
  baseURL: "http://localhost:5000",  // <-- your Flask backend URL
});

export const getCourses = () => API.get("/testcourses");
export const addCourse = (newCourse) => API.post("/addcourse", newCourse);
export const getCourse = (id) => API.get(`/course/${id}`);
export const updateCourse = (id, updatedCourse) => API.put(`/course/${id}`, updatedCourse);
export const deleteCourse = (id) => API.delete(`/course/${id}`);
