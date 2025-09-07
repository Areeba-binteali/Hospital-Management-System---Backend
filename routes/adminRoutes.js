const { deleteUser } = require("../controllers/adminControllers/deleteUser");
const { getAllUsers, getAllStaff, getAllDoctors, getAllPatients } = require("../controllers/adminControllers/getUsersController");
const { handleLeaveRequest, getAllLeaveRequests } = require("../controllers/adminControllers/handleLeaveRequestsController");

const adminRouter = require("express").Router();

adminRouter.get("/leave-requests", getAllLeaveRequests);
adminRouter.put("/update-leave/:id", handleLeaveRequest);
adminRouter.get("/users", getAllUsers);
adminRouter.get("/staff", getAllStaff);
adminRouter.get("/staff/:id", getAllStaff);
adminRouter.get("/doctors", getAllDoctors);
adminRouter.get("/doctors/:id", getAllDoctors);
adminRouter.get("/patients", getAllPatients);
adminRouter.get("/patients/:id", getAllPatients);
adminRouter.delete("/delete-user/:id", deleteUser)

module.exports = adminRouter;