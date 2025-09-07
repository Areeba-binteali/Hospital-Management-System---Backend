const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    permissions: [{
        type: String,
        enum: ['manageUsers', 'manageStaff', 'manageAppointments', 'viewReports']
    }],
    accessLevel: {
        type: Number,
        default: 1
    }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
