const AppointmentRequest = require("../../models/appointment");


const getAssignedAppointments = async (req, res) => {
    try {
        const assignedAppointments = await AppointmentRequest.find()
            .populate({
                path: "userId", 
                select: "userName"
            })
            .populate({
                path: "assignedDoctor",
                select: "_id",
                populate: { path: "userId", select: "userName _id" }
            })
            .then(requests => requests.filter(r => r.assignedDoctor?.userId?._id.toString() === req.userId));


        if (!assignedAppointments || assignedAppointments.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No assigned appointments found",
                appointments: []
            });
        }

        return res.status(200).send({
            success: true,
            message: "Assigned appointments retrieved successfully",
            appointments: assignedAppointments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getAssignedAppointments
};
