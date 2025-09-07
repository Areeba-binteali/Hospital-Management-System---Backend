const bcrypt  = require("bcrypt");
const User = require("../../models/user");
const jwt = require("jsonwebtoken")

const signinController = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
        if (!emailAddress || !password) {
            return res.status(400).send({
                message: "Please provide valid Email Address and Password"
            })
        }
        const matchedUser = await User.findOne({ emailAddress: emailAddress });
        if (!matchedUser) {
            return res.status(404).send({
                message: "User not found",
                success: false,
                data: null
            });
        }

        const isValid = await bcrypt.compare(password, matchedUser.password);
        console.log(isValid);
        if (isValid) {
            const token = jwt.sign({
                _id: matchedUser._id,
                email: matchedUser.emailAddress,
                role: matchedUser.role,
            },process.env.JWT_SECRET)
            return res.send({
                data: matchedUser,
                success: true,
                token: token
            })
        } else {
            return res.status(400).send({
                data: null,
                success: false,
                message: "Invalid credentials"
            })
        }
    } catch (error) {
         res.status(500).send({ data: null, success: false, error })
    }
}

module.exports = {
    signinController,
}