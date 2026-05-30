import {User} from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import genToken from "../config/token.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

//login with google
const googleAuth = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new ApiError(400, "Name and email are required");
    }

    let user = await User.findOne({ email }); 
 
    if (!user) {
        user = await User.create({ 
            name, email,
            authProvider: "google", // Set authProvider to "google" for users signing up via Google OAuth
            credits: 100 // Give 100 credits to every user when they sign up
        });
    } else if (user.authProvider === "email") {
        // Existing email user logging in with Google
        // Update their provider to "both"
        user.authProvider = "both"
        await user.save()
    } 
    // If already "google" or "both" — just login normally 

    const token = await genToken(user._id);

    //cookies
    const cookieOptions = {
        httpOnly: true, 
        secure: true,  
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days 
    };

   return res
    .status(200)
    .cookie("token", token, cookieOptions) // Set the token in an HTTP-only, secure cookie with SameSite=None to allow cross-site usage
    .json(new ApiResponse(
        200, 
        user, 
        "Login successful"
    ));
});


//Register User
const registerUser = asyncHandler(async(req,res)=>{
    const { name, email, password, confirmPassword } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
        throw new ApiError(400, "Name, email, password and confirm password are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and confirm password do not match")
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters")
    }

    // Check if email already exists
    const existingUser = await User.findOne({
         email: email.toLowerCase() 
        })
    
    if (existingUser){
        // Email exists with Google auth → tell them to use Google or set password
        if (existingUser.authProvider === "google") {
            throw new ApiError(400, "This email is registered with Google. Please login with Google or use forgot password to set a password.")
        }
        throw new ApiError(409, "Email already registered. Please login.")
    }

    //create user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        authProvider: "email", // Set authProvider to "email" for users signing up via email/password
        credits: 100 // Give 100 credits to every user when they sign up
    })

    // remove password 
    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "User creation failed")
    }

    const token = await genToken(createdUser._id)
    
    //cookies
    const cookieOptions = {
        httpOnly: true, 
        secure: true,  
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days 
    };

    return res
    .status(201)
    .cookie("token", token, cookieOptions) 
    .json(new ApiResponse(
        201, 
        createdUser, 
        "User registered successfully"
    ));
})


//Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ 
        email: email.toLowerCase()
    });

    if (!user) {
        throw new ApiError(404, "User not found. Please register first.");
    }
    // Google-only user trying email login — no password set
    if (user.authProvider === "google" && !user.password) {
        throw new ApiError(400, "This account uses Google login. Please sign in with Google or use forgot password to set a password.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    
    const token = await genToken(user._id);
    //cookies
    const cookieOptions = {
        httpOnly: true, 
        secure: true,  
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days 
    };

    return res
    .status(200)
    .cookie("token", token, cookieOptions) // Set the token in an HTTP-only, secure cookie with SameSite=None to allow cross-site usage
    .json(new ApiResponse(
        200, 
        user, 
        "Login successful"
    ));
});


//logout user by clearing the cookie
const logoutUser = asyncHandler(async (req, res) => {
    
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
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


export { googleAuth, registerUser,loginUser, logoutUser };
