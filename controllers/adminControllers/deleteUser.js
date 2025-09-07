const Admin = require("../../models/admin");
const Doctor = require("../../models/doctor");
const Patient = require("../../models/patient");
const Staff = require("../../models/staff");
const User = require("../../models/user");


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; 

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    
    switch (user.role) {
      case "doctor":
        await Doctor.findOneAndDelete({ userId: id });
        break;
      case "staff":
        await Staff.findOneAndDelete({ userId: id });
        break;
      case "admin":
        await Admin.findOneAndDelete({ userId: id });
        break;
      case "patient":
        await Patient.findOneAndDelete({ userId: id });
        break;
      default:
        break;
    }

    return res.status(200).json({
      success: true,
      message: `User and related ${user.role} record deleted successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

module.exports = { 
    deleteUser, 
};
