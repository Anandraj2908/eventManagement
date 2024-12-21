import { Router } from "express";

import { 
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
 } from "../controllers/event.controller.js";
import { verifyJWT } from "../auth.middleware.js";

const router = Router();

router.route("/get-all-events").get(verifyJWT,getAllEvents);
router.route("/create-event").post(verifyJWT,createEvent);
router.route("/update-event/:eventId").patch(verifyJWT,updateEvent);
router.route("/delete-event/:eventId").delete(verifyJWT,deleteEvent);

export default  router ;