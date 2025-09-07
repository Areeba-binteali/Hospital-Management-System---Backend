const { getAllNotes } = require("../controllers/staffControllers/assignedNotesController");
const checkDoctorAvailabilty = require("../controllers/staffControllers/checkDoctors");
const { submitLeaveRequest } = require("../controllers/staffControllers/leaveRequestController");
const { getAllRequests, updateRequest } = require("../controllers/staffControllers/patientsRequestController");

const staffRouter = require("express").Router();

staffRouter.get("/all-requests", getAllRequests);
staffRouter.get("/all-doctors", checkDoctorAvailabilty);
staffRouter.put("/update-request/:id", updateRequest);
staffRouter.post("/request-leave", submitLeaveRequest);
staffRouter.get("/assigned-notes", getAllNotes);

module.exports = staffRouter;