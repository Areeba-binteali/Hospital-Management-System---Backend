const Doctor = require("../../models/doctor");
const LeaveRequest = require("../../models/leaveRequest");
const Staff = require("../../models/staff");
const User = require("../../models/user");

const handleLeaveRequest = async (req, res) => {
    try {
        const targetId = req.params.id; 
        const { status } = req.body; 

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(422).send({
                success: false,
                message: "Status must be either approved, rejected, or pending"
            });
        }

        const leaveRequest = await LeaveRequest.findById(targetId).populate("userId", "userName role");
        if (!leaveRequest) {
            return res.status(404).send({
                success: false,
                message: "Leave request not found"
            });
        }

        leaveRequest.status = status;
        leaveRequest.updatedAt = Date.now();
        await leaveRequest.save();

        const user = await User.findById(leaveRequest.userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        if (status === "approved") {
            if (user.role === "doctor") {
                await Doctor.findOneAndUpdate(
                    { userId: user._id },
                    { isAvailable: false }
                );
            } else if (user.role === "staff") {
                await Staff.findOneAndUpdate(
                    { userId: user._id },
                    { isAvailable: false }
                );
            }
        } else {
            if (user.role === "doctor") {
                await Doctor.findOneAndUpdate(
                    { userId: user._id },
                    { isAvailable: true }
                );
            } else if (user.role === "staff") {
                await Staff.findOneAndUpdate(
                    { userId: user._id },
                    { isAvailable: true }
                );
            }
        }

        return res.status(200).send({
            success: true,
            message: `Leave request ${status} successfully`,
            leaveRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllLeaveRequests = async (req, res) => {
    try {
        const queryRole = req.query.role; 

        if (queryRole) {
            if (queryRole !== "doctor" && queryRole !== "staff") {
                return res.status(422).send({
                    success: false,
                    message: "Invalid role type"
                });
            }

            const matchedRequests = await LeaveRequest.find({})
                .populate({
                    path: "userId",
                    select: "userName role",
                    match: { role: queryRole }
                });

            const filteredRequests = matchedRequests.filter(r => r.userId !== null);

            if (!filteredRequests || filteredRequests.length === 0) {
                return res.status(200).send({
                    success: true,
                    message: `No ${queryRole} leave requests found at the moment`
                });
            }

            return res.status(200).send({
                success: true,
                message: `${queryRole} leave requests`,
                requests: filteredRequests
            });
        }

        // agr role query param na bheja ho
        const allRequests = await LeaveRequest.find({})
            .populate("userId", "userName role");

        if (!allRequests || allRequests.length === 0) {
            return res.status(200).send({
                success: true,
                message: "There are no leave requests at the moment"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Here are all leave requests",
            requests: allRequests
        });

    } catch (error) {
        console.error("Error fetching leave requests:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    handleLeaveRequest,
    getAllLeaveRequests,
};
