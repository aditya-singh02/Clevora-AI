import mongoose from "mongoose";
import { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        }, 
        // we don't need password because we are using google auth, so we will not store password in our database
        credits:{
            type: Number,
            default: 100, // we will give 100 credit to every user when they sign up 
        }
    }, { timestamps: true }) 

export const User = mongoose.model("User", userSchema);