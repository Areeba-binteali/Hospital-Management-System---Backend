const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const Admin = require("../../models/admin");
const Staff = require("../../models/staff");
const Patient = require("../../models/patient");

const updateProfileController = async (req, res) => {
    try {
        const userId = req.userId;   // middleware se mila
        const role = req.userRole;   // middleware se mila

        // Define allowed fields based on role
        const roleFields = {
            admin: ["permissions", "accessLevel"],
            staff: ["position", "department", "shiftTimings"],
            doctor: ["specialization", "experienceYears", "clinicAddress", "availableSlots"],
            patient: ["medicalHistory", "bloodGroup", "emergencyContact"],
        };

        // General user fields that anyone can update
        const userFields = ["userName", "dob", "profileImage"];

        // Requested update data
        const updateData = req.body;

        // Validate incoming fields
        const allowed = [...userFields, ...roleFields[role]];
        const invalidFields = Object.keys(updateData).filter((key) => !allowed.includes(key));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid fields for role '${role}': ${invalidFields.join(", ")}`,
            });
        }

        // Update general user info
        const userUpdates = {};
        for (let key of userFields) {
            if (updateData[key] !== undefined) {
                userUpdates[key] = updateData[key];
            }
        }

        if (Object.keys(userUpdates).length > 0) {
            await User.findByIdAndUpdate(userId, { $set: userUpdates }, { new: true });
        }

        // Update role-specific schema
        const roleUpdates = {};
        for (let key of roleFields[role]) {
            if (updateData[key] !== undefined) {
                roleUpdates[key] = updateData[key];
            }
        }

        let roleModel;
        switch (role) {
            case "admin":
                roleModel = Admin;
                break;
            case "staff":
                roleModel = Staff;
                break;
            case "doctor":
                roleModel = Doctor;
                break;
            case "patient":
                roleModel = Patient;
                break;
        }

        let roleDoc = await roleModel.findOneAndUpdate(
            { userId },
            { $set: roleUpdates },
            { new: true, upsert: true } // if doc doesn't exist yet, create it
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: await User.findById(userId).select("-password"),
                roleData: roleDoc
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    updateProfileController,
};
