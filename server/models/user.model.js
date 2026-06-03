import mongoose from "mongoose";
import { Schema } from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            default: null,
        },
        passwordHistory: { // to store last 3 passwords for security purposes
            type: [String],
            default: []
        },
        authProvider: { // to track whether the user signed up with google, email or both
            type: String,
            enum: ["google", "email", "both"],
            default: "email"
        },
        credits: {
            type: Number,
            default: 100, // we will give 100 credit to every user when they sign up 
        },

        // Forgot password fields
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpiry: {
            type: Date,
            default: null
        },
        // Email verification fields
        isVerified: {
            type: Boolean,
            default: false        // register pe false, OTP verify pe true
        },
        otp: {
            type: String,
            default: null         // hashed OTP stored here
        },
        otpExpiry: {
            type: Date,
            default: null         // 10 minutes expiry
        },
    }, { timestamps: true })

    userSchema.pre("save", async function () {
        if (!this.isModified("password")) return;

        this.password = await bcrypt.hash(this.password, 10);
    });

    userSchema.methods.isPasswordCorrect = async function (password) { 
        return await bcrypt.compare(password, this.password);
    };

export const User = mongoose.model("User", userSchema);