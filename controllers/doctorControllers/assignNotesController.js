const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const Patient = require("../../models/patient");
const Note = require("../../models/note");
const { isValidObjectId } = mongoose;


const createNote = async (req, res) => {
    try {
        const { content, assignedTo, patientId } = req.body;

        if (!content || !assignedTo || !patientId) {
            return res.status(400).json({
                success: false,
                message: "content, assignedTo (staffId) aur patientId required hain"
            });
        }

        if (!isValidObjectId(assignedTo) || !isValidObjectId(patientId)) {
            return res.status(422).json({
                success: false,
                message: "Invalid assignedTo or patientId"
            });
        }

        const doctor = await Doctor.findOne({ userId: req.userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const staff = await Staff.findById(assignedTo);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Assigned staff not found" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // create note
        const note = await Note.create({
            content,
            createdBy: doctor._id,
            assignedTo: staff._id,
            patient: patient._id
        });

        // populating for readability in response
        const populated = await Note.findById(note._id)
            .populate({ path: "patient", select: "_id", populate: { path: "userId", select: "userName" } })
            .populate({
                path: "createdBy",
                select: "_id",
                populate: { path: "userId", select: "userName" }
            })
            .populate({
                path: "assignedTo",
                select: "_id",
                populate: { path: "userId", select: "userName" }
            });

        return res.status(201).json({
            success: true,
            message: "Note created and assigned successfully",
            note: populated
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const matchedDoctor = await Doctor.findOne({ userId: userId });
        const matchedNotes = await Note.find({ createdBy: matchedDoctor })
            .populate({ path: "patient", select: "_id", populate: { path: "userId", select: "userName" } })
            .populate({
                path: "createdBy",
                select: "_id",
                populate: { path: "userId", select: "userName" }
            })
            .populate({
                path: "assignedTo",
                select: "_id",
                populate: { path: "userId", select: "userName" }
            });
        ;

        if (!matchedNotes || matchedNotes.length == 0) {
            return res.status(200).send({
                success: true,
                message: "No notes at the moment"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Here are the Notes created by you",
            data: matchedNotes,
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createNote,
    getAllNotes,
};
