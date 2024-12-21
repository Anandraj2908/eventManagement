import { ApiError } from "./utils/ApiError.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const parseCookies = (cookieString) => {
            return cookieString
                ?.split(";")
                .map(cookie => cookie.trim().split("="))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        };

        const cookies = parseCookies(req.headers.cookie);
        const token = cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized: Access token is missing");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Unauthorized: Invalid access token");
        }

        req.user = user; 
        next(); 
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid access token");
    }
});
