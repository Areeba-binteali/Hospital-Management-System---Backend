const Doctor = require("../../models/doctor");
const Patient = require("../../models/patient");
const Staff = require("../../models/staff");
const User = require("../../models/user");


const getAllUsers = async (req, res) => {
  try {
    const queryRole = req.query.role;

    if (queryRole) {
      const matchedUsers = await User.find({ role: queryRole });

      if (!matchedUsers || matchedUsers.length === 0) {
        return res.status(200).send({
          success: true,
          message: `No users found with role: ${queryRole}`
        });
      }

      return res.status(200).send({
        success: true,
        message: `${queryRole} users`,
        users: matchedUsers
      });
    }

    const allUsers = await User.find({});
    if (!allUsers || allUsers.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No users found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "All users",
      users: allUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const getAllStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    if (staffId) {
      const staff = await Staff.findById(staffId).populate("userId", "userName role");
      if (!staff) {
        return res.status(404).send({
          success: false,
          message: "Staff not found"
        });
      }
      return res.status(200).send({
        success: true,
        message: "Staff member found",
        staff
      });
    }

    const allStaff = await Staff.find({}).populate("userId", "userName role");
    if (!allStaff || allStaff.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No staff members found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "All staff members",
      staff: allStaff
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const getAllDoctors = async (req, res) => {
  try {
    const doctorId = req.params.id;

    if (doctorId) {
      const doctor = await Doctor.findById(doctorId).populate("userId", "userName role");
      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor not found"
        });
      }
      return res.status(200).send({
        success: true,
        message: "Doctor found",
        doctor
      });
    }

    const allDoctors = await Doctor.find({}).populate("userId", "userName role");
    if (!allDoctors || allDoctors.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No doctors found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "All doctors",
      doctors: allDoctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const getAllPatients = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (patientId) {
      const patient = await Patient.findById(patientId).populate("userId", "userName role");
      if (!patient) {
        return res.status(404).send({
          success: false,
          message: "Patient not found"
        });
      }
      return res.status(200).send({
        success: true,
        message: "Patient found",
        patient
      });
    }

    const allPatients = await Patient.find({}).populate("userId", "userName role");
    if (!allPatients || allPatients.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No patients found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "All patients",
      patients: allPatients
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
};


module.exports = {
    getAllUsers,
    getAllStaff,
    getAllDoctors,
    getAllPatients,
}