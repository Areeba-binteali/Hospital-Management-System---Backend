require("dotenv").config();
require("./config/db")

const express = require("express");
const logReqBody = require("./middleware/logReqBody");
const publicRouter = require("./routes/publicRoutes");
const staffRouter = require("./routes/staffRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const adminRouter = require("./routes/adminRoutes");
const allowedRoles = require("./middleware/allowedRoles");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(logReqBody);
app.use(cors());


// router middleware
app.use("/api/v1/", publicRouter);
app.use("/api/v2/", authMiddleware, allowedRoles("admin", "staff"), staffRouter);
app.use("/api/v3/", authMiddleware, allowedRoles("doctor"), doctorRouter);
app.use("/api/v4/", authMiddleware, allowedRoles("admin"), adminRouter);

app.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        message: "Welcome to the Hospital Management System"
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

module.exports = app;