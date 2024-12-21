import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/event.model.js";

const createEvent = asyncHandler(
    async (req, res) => {
        const {name, description, date, location} = req.body;

        if(!name || !description || !date || !location){
            throw new ApiError(400, "All fields are required")
        }

        const event = await Event.create({
            name,
            description,
            date,
            location,
            createdBy: req.user._id
        })
        
        if(!event){
            throw new ApiError(500, "Something went wrong while creating event")
        }


        return res.status(200).json(
            new ApiResponse(200, event,"Event created")
        )
    }
);

const updateEvent = asyncHandler(
    async (req, res) => {
        const {name, description, date, location} = req.body;
        const {eventId} = req.params;

        if(!name || !description || !date || !location){
            throw new ApiError(400, "All fields are required")
        }

        const event = await Event.findByIdAndUpdate(eventId, {
            name,
            description,
            date,
            location,
        }, {new: true})

        if(!event){
            throw new ApiError(404, "Event not found")
        }

        return res.status(200).json(
            new ApiResponse(200, event,"Event updated")
        )
    }
);

const deleteEvent = asyncHandler(
    async (req, res) => {
        const {eventId} = req.params;

        const event = await Event.findByIdAndDelete(eventId)

        if(!event){
            throw new ApiError(404, "Event not found")
        }

        return res.status(200).json(
            new ApiResponse(200, null,"Event deleted")
        )
    }
);

const getAllEvents = asyncHandler(
    async (req, res) => {
        console.log(req.user)
        const events = await Event.find({createdBy: req.user._id});

        return res.status(200).json(
            new ApiResponse(200, events,"All events")
        )
    }
);

export { 
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents
 };