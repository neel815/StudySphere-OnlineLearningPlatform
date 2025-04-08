// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail,getPayments,deletePayments,getBlogs,createBlog } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, capturePayment)
router.post("/verifyPayment",auth, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail);
router.get("/getPayments", getPayments);
router.post("/deletePayments", deletePayments);
router.post("/createBlog",  createBlog);
router.get("/getBlogs",  getBlogs);

module.exports = router;