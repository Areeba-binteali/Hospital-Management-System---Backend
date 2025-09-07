const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const staffSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    position: {
        type: String,
    },
    department: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    shiftTimings: {
        type: String
    }
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
