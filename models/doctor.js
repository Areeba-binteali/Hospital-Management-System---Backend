const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    specialization: {
        type: String,
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    clinicAddress: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    availableSlots: [{
        day: String,
        time: String
    }]
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
