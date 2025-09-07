const { createNote, getAllNotes } = require("../controllers/doctorControllers/assignNotesController");
const { getAssignedAppointments } = require("../controllers/doctorControllers/getAssignedAppointmentsController");
const { submitLeaveRequest } = require("../controllers/doctorControllers/leaveRequestController");

const doctorRouter = require("express").Router();

doctorRouter.post("/request-leave", submitLeaveRequest);
doctorRouter.get("/assigned-appointments", getAssignedAppointments);
doctorRouter.post("/create-note", createNote);
doctorRouter.get("/get-all-notes", getAllNotes);

module.exports = doctorRouter;