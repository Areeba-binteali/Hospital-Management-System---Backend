const AppointmentRequest = require("../../models/appointment");
const Doctor = require("../../models/doctor");

const getAllRequests = async (req, res) => {

    const queryStatus = req.query.status;

    if (queryStatus) {
        if (queryStatus !== "pending" && queryStatus !== "approved" && queryStatus !== "rejected") {
            return res.status(422).send({
                success: false,
                message: "Invalid Request"
            });
        }
        const matchedRequests = await AppointmentRequest.find({ status: queryStatus }).populate("userId", "userName");

        if (!matchedRequests) {
            return res.status(200).send({
                success: true,
                message: "No matching requests at the moment"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Patient's Requests",
            requests: matchedRequests
        })
    }

    const patientsRequests = await AppointmentRequest.find({}).populate("userId", "userName");

    if (!patientsRequests) {
        return res.status(200).send({
            success: true,
            message: "There are no requests at the moment"
        })
    }
    return res.status(200).send({
        success: true,
        message: "Here are all requests",
        requests: patientsRequests
    })
}


const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { assignedDoctor, status, appointmentTime } = req.body;


    if (status && !["pending", "approved", "rejected"].includes(status)) {
        return res.status(422).send({
            success: false,
            message: "Invalid status value"
        });
    }

    const updateData = {};

    try {

        if (assignedDoctor !== undefined) {
            const doctor = await Doctor.findById(assignedDoctor);
            if (!doctor) {
                return res.status(404).send({
                    success: false,
                    message: "Assigned doctor not found"
                });
            }

            if (!doctor.isAvailable) {
                return res.status(422).send({
                    success: false,
                    message: "Doctor is not available for assignment"
                });
            }

            updateData.assignedDoctor = assignedDoctor;
        }

        if (status !== undefined) updateData.status = status;
        if (appointmentTime !== undefined) updateData.appointmentTime = appointmentTime;

        const updatedRequest = await AppointmentRequest.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate({
            path: "assignedDoctor",       
            populate: {
                path: "userId",           
                select: "userName"       
            }
        });

        if (!updatedRequest) {
            return res.status(404).send({
                success: false,
                message: "Appointment request not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Appointment request updated successfully",
            request: updatedRequest
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};


module.exports = {
    getAllRequests,
    updateRequest,
}