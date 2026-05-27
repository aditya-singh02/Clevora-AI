import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Extract token from cookies or Authorization header fallback
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized access - No token provided");
        }

        // 2. Verify the token signature using your JWT_SECRET string
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user in Mon goDB matching the decoded payload token id
        const user = await User.findById(decodedToken?.userId).select("__v"); // Exclude sensitive keys from passing forward

        if (!user) {
            throw new ApiError(401, "Invalid  token - User does not exist");
        }

        // 4. Attach the retrieved user object directly to the request cycle
        req.user = user;
        
        // 5. Pass control safely over to the next controller in the pipeline
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "auth middleware error");
    }
}) 

export default verifyJWT
