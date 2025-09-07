const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
