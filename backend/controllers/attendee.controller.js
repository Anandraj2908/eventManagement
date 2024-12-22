import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Attendee } from "../models/attendee.model.js";
import { Task } from "../models/task.model.js";


const createAttendee = asyncHandler(
    async (req, res) => {
        const {eventId} = req.params;
        const {name} = req.body;

        if(!name || !eventId){
            throw new ApiError(400, "All fields are required")
        }

        const attendee = await Attendee.create({
            name,
            eventId
        });

        if(!attendee){
            throw new ApiError(500, "Something went wrong while creating attendee")
        }

        return res.status(200).json(
            new ApiResponse(200, attendee,"Attendee created")
        )
    }
);

const deleteAttendee = asyncHandler(
    async (req, res) => {
        const {attendeeId} = req.params;

        const attendee = await Attendee.findByIdAndDelete(attendeeId);

        if(!attendee){
            throw new ApiError(404, "Attendee not found")
        }

        await Task.deleteMany({assignedTo:attendeeId});

        return res.status(200).json(
            new ApiResponse(200, null,"Attendee deleted")
        )
    }
);

const getAttendees = asyncHandler(
    async (req, res) => {
        const {eventId} = req.params;

        const attendees = await Attendee.find({eventId});

        return res.status(200).json(
            new ApiResponse(200, attendees,"Attendees")
        )
    }
);

export { 
    createAttendee,
    deleteAttendee,
    getAttendees
 };