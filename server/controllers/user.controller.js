import  asyncHandler  from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {Interview} from "../models/interview.model.js";
import Payment from "../models/payment.model.js";
import { User } from "../models/user.model.js";

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(404, "Authenticated user data context not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user details fetched successfully"
            )
        )
})

const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Unauthorized: User ID missing in request context");
    }

    const deletedUser = await User.findById(userId);

    if (!deletedUser) {
        throw new ApiError(404, "User not found or already deleted");
    }

    // Cascade delete all interviews and payments associated with the user to maintain data integrity and prevent orphaned records in the database.
    await Interview.deleteMany({ userId });
    await Payment.deleteMany({ userId });
    
    // Delete the user account from the database
    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "User account deleted successfully"
            )
        );
})

export  {getCurrentUser, deleteAccount}