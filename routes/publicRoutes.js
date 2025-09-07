const { createAppointmentRequest, deleteRequest, getAllAppointments } = require("../controllers/publicControllers/newAppointmentRequestsController");
const { signinController } = require("../controllers/publicControllers/signinController");
const { signUpController } = require("../controllers/publicControllers/signupController");
const { updateProfileController } = require("../controllers/publicControllers/updateProfileController");
const authMiddleware = require("../middleware/authMiddleware");

const publicRouter = require("express").Router();

// Signup Handler
publicRouter.post("/signup", signUpController);
publicRouter.post("/signin", signinController);
publicRouter.put("/update-profile", authMiddleware, updateProfileController);
publicRouter.post("/new-appointment-request", authMiddleware, createAppointmentRequest);
publicRouter.delete("/requests/:id", authMiddleware, deleteRequest);
publicRouter.get("/all-requests", authMiddleware, getAllAppointments);

module.exports = publicRouter;