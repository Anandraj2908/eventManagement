import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(
    async (req, res) => {
        const {eventId, attendeeId} = req.params;
        const {name, deadline} = req.body;

        if(!name || !deadline || !eventId || !attendeeId){
            throw new ApiError(400, "All fields are required")
        }

        const task = await Task.create({
            name,
            deadline,
            eventId,
            assignedTo: attendeeId
        });
        
        if(!task){
            throw new ApiError(500, "Something went wrong while creating task")
        }

        return res.status(200).json(
            new ApiResponse(200, task,"Task created")
        )
    }
);

const updateTaskStatus = asyncHandler(
    async (req, res) => {
        const {taskId} = req.params;
        const {status} = req.body;

        if(!status){
            throw new ApiError(400, "Status is required")
        }

        const validStatuses = ['Pending', 'Completed'];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status. Valid statuses are 'Pending' or 'Completed'.");
        }

        const task = await Task.findByIdAndUpdate(taskId, {
            status
        }, {new: true})

        if(!task){
            throw new ApiError(404, "Task not found")
        }

        return res.status(200).json(
            new ApiResponse(200, task,"Task updated")
        )
    }
);

const getTasks = asyncHandler(
    async (req, res) => {
        const {eventId} = req.params;

        const tasks = await Task.find({eventId});

        return res.status(200).json(
            new ApiResponse(200, tasks,"Tasks")
        )
    }
);

export { 
    createTask,
    updateTaskStatus,
    getTasks
 };