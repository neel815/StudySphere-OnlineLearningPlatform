const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    upiId: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("Payment", paymentSchema);