const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    role: {
        type: String,
        enum: ['doctor', 'patient', 'staff', 'admin'],
        default: 'patient',
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

userSchema.index({ emailAddress: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
