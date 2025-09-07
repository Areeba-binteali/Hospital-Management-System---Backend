const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const Patient = require("../../models/patient");
const Admin = require("../../models/admin");

const signUpController = async (req, res) => {
    try {
        const { userName, emailAddress, password, role } = req.body;

        if (!userName || !emailAddress || !password || !role) {
            return res.status(400).send({
                success: false,
                message: "Please fill in all the required fields (Name, Email, Password, Role)"
            })
        }

        const existingUser = await User.findOne({ emailAddress });
        if (existingUser) {
            res.status(400).send({
                success: false,
                message: "User already exist. Please login"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            emailAddress,
            password: hashedPassword,
            role
        });
        await newUser.save();

        if (newUser.role == "doctor") {
            await Doctor.create({
                userId: newUser._id
            })
        } else if (newUser.role == "staff") {
            await Staff.create({
                userId: newUser._id
            })
        } else if (newUser.role == "patient") {
            await Patient.create({
                userId: newUser._id
            })
        } else if (newUser.role == "admin") {
            await Admin.create({
                userId: newUser._id
            })
        }
        res.status(201).send({
            success: true,
            message: "User registered successfully!",
            user: newUser
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err,
        })
    }
}


module.exports = {
    signUpController,
}