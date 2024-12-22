import { Router } from "express";

import { 
    createTask,
    updateTaskStatus,
    getTasks
 } from "../controllers/tasks.controller.js";
import { verifyJWT } from "../auth.middleware.js";

const router = Router();

router.route("/create-task/:eventId/:attendeeId").post(verifyJWT,createTask);
router.route("/update-task-status/:taskId").patch(verifyJWT,updateTaskStatus);
router.route("/get-tasks/:eventId").get(verifyJWT,getTasks);

export default  router ;