import { Router } from "express";

import { 
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(verifyJWT,refreshAccessToken);

export default  router ;