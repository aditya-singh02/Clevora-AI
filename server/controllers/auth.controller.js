import {User} from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import genToken from "../config/token.js";
import { sendPasswordResetEmail, sendOTPEmail } from "../services/email.service.js";
import crypto from "crypto";
import bcrypt from "bcrypt";


// Strong password validation regex pattern
const isStrongPassword = (password) => {
    // 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};


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
    // Only allow official Gmail addresses to ensure authenticity and reduce spam accounts
    if (!email?.trim().toLowerCase().endsWith("@gmail.com")) {
        throw new ApiError(400, "Only official @gmail.com email addresses are allowed on this platform.");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and confirm password do not match")
    }

    if (!isStrongPassword(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &).")
    }

    // Check if email already exists
    const existingUser = await User.findOne({
         email: email.toLowerCase() 
        })
    
    if (existingUser){

        // If user exists but is not verified, resend OTP instead of throwing error
        if (!existingUser.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

            existingUser.otp = hashedOtp
            existingUser.otpExpiry = Date.now() + 10 * 60 * 1000
            await existingUser.save({ validateBeforeSave: false })

            await sendOTPEmail({ email: existingUser.email, otp, name: existingUser.name })

            return res.status(200).json(new ApiResponse(200, {
                email: existingUser.email,
                message: "OTP resent"
            }, "OTP sent to your Gmail. Please verify."))
        }

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
        credits: 100, // Give 100 credits to every user when they sign up
        isVerified: false // User needs to verify email via OTP
    })

    // Store password history for security purposes (e.g., to prevent reuse of last 3 passwords)
    user.passwordHistory.push(user.password);
    if (user.passwordHistory.length > 3) {
        user.passwordHistory.shift(); // Keep only the last 3 passwords
    }

    // 6 digit OTP generate 
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Hash the OTP before saving to DB for security
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    user.otp = hashedOtp                              
    user.otpExpiry = Date.now() + 10 * 60 * 1000  // OTP expires in 10 minutes

    await user.save();

    await sendOTPEmail({ email: user.email, otp, name: user.name })

    return res
        .status(200)
        .json(new ApiResponse(200,
            { email: user.email },
            "OTP sent to your Gmail. Please verify to complete registration."
        ))
})

// Note: OTP verification route is not included here but would be a separate endpoint where user submits email and OTP, we verify the hashed OTP and expiry, then set isVerified to true if valid.
// OTP verification route - user submits email and OTP → we hash the OTP from request and compare with stored hash + check expiry → if valid, set isVerified to true and clear OTP fields, then log the user in by generating token and setting cookie.
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp?.trim()) {
        throw new ApiError(400, "Email and OTP are required");
    }
    // Hash the OTP from request to compare with stored hash
    const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex")

    const user = await User.findOne({
        email: email.toLowerCase(),
        otp: hashedOtp,
        otpExpiry: { $gt: Date.now() }   // expired nahi hona chahiye
    })

    if (!user) {
        throw new ApiError(404, "Invalid or expired OTP. Please try again.");
    }
    
    if (user.isVerified) {
        throw new ApiError(400, "User is already verified. Please login.");
    }   

    // OTP is valid, verify user
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save({ validateBeforeSave: false })

    const token = await genToken(user._id)

    //cookies
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days 
    };

    // Return user data without sensitive fields like password and OTP
    const userData = await User.findById(user._id).select("-password -otp -otpExpiry -passwordHistory")

    return res
        .status(201)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(
            201,
            userData,
            "Account verified! Welcome to Clevora."
        ));
})


//Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    if (!email?.trim().toLowerCase().endsWith("@gmail.com")) {
        throw new ApiError(400, "Invalid email domain. Please use a @gmail.com address.");
    }

    // Password length check before querying the database to prevent unnecessary load from invalid requests
    if (password.length < 8) {
        throw new ApiError(400, "Invalid credentials. Password must be at least 8 characters long.");
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

//Forgot password
//Flow: User submits email → If user exists, generate reset token, save hashed version and expiry to DB, send email with reset link containing raw token → User clicks link, submits new password along with token → Verify token and expiry, if valid update password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    if (!email?.trim().toLowerCase().endsWith("@gmail.com")) {
        throw new ApiError(400, "Invalid email domain. Please use a @gmail.com address.");
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Hash before storing — never store raw tokens
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    // Save to user — expires in 15 minutes
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000 // 15 minutes from now
    await user.save({ validateBeforeSave: false }); 

    // Reset URL sent to user — contains RAW token (not hashed)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${user.email}`

    // Send email
    await sendPasswordResetEmail({
        email: user.email,
        resetUrl,
        name: user.name
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset link sent to your email"))
})

// Reset password
const resetPassword = asyncHandler(async (req, res) => {

    const { email, token, newPassword, confirmNewPassword } = req.body;

    if (!email?.trim() || !token?.trim() || !newPassword?.trim() || !confirmNewPassword?.trim()) {
        throw new ApiError(400, "Email, token, new password and confirm new password are required");
    }

    if(!isStrongPassword(newPassword)) {
        throw new ApiError(400, "New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &).");
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match");
    }

    //Hash the token from URL to compare with stored hash
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() } // Check if token is not expired
    })
    
    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    // Check if new password is same as any of the last 3 passwords
    for (let oldPasswordHash of user.passwordHistory) {
        const isSameAsOld = await bcrypt.compare(newPassword, oldPasswordHash);
        if (isSameAsOld) {
            throw new ApiError(400, "New password cannot be the same as any of the last 3 passwords. Please choose a different password.");
        }
    }

    // Update password and clear reset token fields
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    
    // If Google user sets password → they can now use both
    if (user.authProvider === "google") {
        user.authProvider = "both"
    }

    await user.save();

    // Update password history
    user.passwordHistory.push(user.password); // Add current password hash to history
    if (user.passwordHistory.length > 3) {
        user.passwordHistory.shift(); // Keep only the last 3 passwords
    }
    // save again to update password history without triggering validation errors since password is already hashed and valid
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully. Please login."));

})

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

export { 
    googleAuth, 
    registerUser,
    loginUser, 
    logoutUser, 
    forgotPassword ,
    resetPassword,
    verifyOtp
};
