import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import genToken from "../config/token.js";

//login with google
const googleAuth = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new ApiError(400, "Name and email are required");
    }

    let user = await User.findOne({ email }); 
 
    if (!user) {
        user = await User.create({ name, email });
    }

    const token = await genToken(user._id);

    //cookies
    const cookieOptions = {
        httpOnly: true, 
        secure: true,  
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days 
    };

   return res
    .status(200)
    .cookie("token", token, cookieOptions) // Set the token in an HTTP-only, secure cookie with SameSite=None to allow cross-site usage
    .json(new ApiResponse(
        200, 
        { token }, 
        "Login successful"
    ));
});

//logout user by clearing the cookie
const logoutUser = asyncHandler(async (req, res) => {
    
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    };

    // Clear the "token" cookie by setting its value to null and making it expire instantly
    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "User logged out successfully"
            )
        );
});


export { googleAuth, logoutUser };
