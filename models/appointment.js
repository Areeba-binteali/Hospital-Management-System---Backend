const mongoose = require("mongoose");

const appointmentRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  appointmentTime: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const AppointmentRequest = mongoose.model("appointment", appointmentRequestSchema);

module.exports = AppointmentRequest;
