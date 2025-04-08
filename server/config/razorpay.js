const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
    
});