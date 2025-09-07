const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


leaveRequestSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

const LeaveRequest = mongoose.model("leave", leaveRequestSchema);
module.exports = LeaveRequest;
