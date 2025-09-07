const Note = require("../../models/note");
const Staff = require("../../models/staff");

const getAllNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const matchedStaff = await Staff.findOne({ userId: userId });
        const matchedNotes = await Note.find({ assignedTo: matchedStaff })
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
            message: "Here are the Notes assigned to you",
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
    getAllNotes,
}