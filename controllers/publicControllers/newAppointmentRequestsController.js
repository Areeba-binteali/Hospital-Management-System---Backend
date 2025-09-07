const AppointmentRequest = require("../../models/appointment");
const jwt = require("jsonwebtoken")

// Create new appointment request
const createAppointmentRequest = async (req, res) => {
    try {
        const userId = req.userId;

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newRequest = new AppointmentRequest({
            userId,
            title,
            description
        });

        await newRequest.save();

        res.status(201).json({
            message: "Appointment request created successfully",
            request: newRequest
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// delete appointment request
const deleteRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const matchedRequest = await AppointmentRequest.findById(id);
        if (!matchedRequest) {
            return res.status(404).send({
                success: false,
                message: "Request not found"
            })
        }

        // Checking if the same user who created the request or any staff member is deleting the request
        const authToken = req.headers.authorization;
        const token = authToken.replace("Bearer ", "");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "staff" && decoded.role !== "admin" && matchedRequest.userId.toString() !== decoded._id.toString()) {
            return res.status(403).send({
                success: false,
                message: "Sorry! you don't have permission to perform this action"
            })
        }
        console.log("matched or not ", matchedRequest.userId.toString() === decoded._id.toString())

        const deleted = await AppointmentRequest.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: "Request deleted successfully!",
            deletedRequest: deleted,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// get all appointment for patient requested by him
const getAllAppointments = async (req, res) => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const requests = await AppointmentRequest.find({ userId: decoded._id }).populate("userId", "userName");
        if (!requests) {
            return res.status(404).send({
                success: false,
                message: "You don't have any requests at the moment"
            })
        }

        if (decoded.role !== "patient") {
            return res.status(400).send({
                success: false,
                message: "Sorry, you are not allowed to access this page"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Here are your requests",
            requests: requests
        })
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

module.exports = {
    createAppointmentRequest,
    deleteRequest,
    getAllAppointments
}
