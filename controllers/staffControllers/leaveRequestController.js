const LeaveRequest = require("../../models/leaveRequest");
const User = require("../../models/user");

const submitLeaveRequest = async (req, res) => {
    const { startDate, endDate, reason } = req.body;

    if (!["staff"].includes(req.userRole)) {
        return res.status(403).send({
            success: false,
            message: "Only staff can submit leave requests here"
        });
    }

    if (!startDate || !endDate || !reason) {
        return res.status(422).send({
            success: false,
            message: "startDate, endDate, and reason are required"
        });
    }

    try {
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const leaveRequest = new LeaveRequest({
            userId: req.userId,
            startDate,
            endDate,
            reason
        });

        const savedRequest = await leaveRequest.save();

        return res.status(201).send({
            success: true,
            message: "Leave request submitted successfully",
            leaveRequest: savedRequest
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    submitLeaveRequest
};
