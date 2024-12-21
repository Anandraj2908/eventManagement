import { Router } from "express";

import { 
    createAttendee,
    deleteAttendee,
    getAttendees
 } from "../controllers/attendee.controller.js";
import { verifyJWT } from "../auth.middleware.js";

const router = Router();

router.route("/get-attendees/:eventId").get(verifyJWT,getAttendees);
router.route("/create-attendee/:eventId").post(verifyJWT,createAttendee);
router.route("/delete-attendee/:attendeeId").delete(verifyJWT,deleteAttendee);

export default  router ;