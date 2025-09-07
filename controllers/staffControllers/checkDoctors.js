const Doctor = require("../../models/doctor")

const checkDoctorAvailabilty = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).populate("userId", "userName");
        const querySpecialization = req.query.specialization;
        const isAvailable = req.query.available;

        if (isAvailable){
            if(isAvailable !== "true" && isAvailable !== "false"){
                return res.status(422).send({
                    success: false,
                    message: "Value must be boolean i.e. true/false"
                })
            }
            const availableDoctors = await Doctor.find({ isAvailable: isAvailable }).populate("userId", "userName");
            
            if(!availableDoctors){
                return res.status(200).send({
                    success: true,
                    message: "No Doctors Available"
                })
            }

            return res.status(200).send({
                success: true,
                message: "Doctors",
                doctors: availableDoctors
            })
        }

        if (querySpecialization){
            const matchedDoctors = await Doctor.find({ specialization: querySpecialization }).populate("userId", "userName");

            if(!matchedDoctors){
                return res.status(200).send({
                    success: true,
                    message: "No Doctors Found"
                })
            }

            return res.status(200).send({
                success: true,
                message: "Doctors with the searched specializations",
                doctors: matchedDoctors,
            })
        }

        return res.status(200).send({
            success: true,
            message: "All Doctors",
            doctors: doctors
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = checkDoctorAvailabilty