const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date
    }],
    bloodGroup: {
        type: String
    },
    emergencyContact: {
        name: String,
        phone: String
    }
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
