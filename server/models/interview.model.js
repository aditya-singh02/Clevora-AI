import mongoose from "mongoose";
import { Schema } from 'mongoose';


const questionSchema = new mongoose.Schema(
    {
        question: String,
        difficulty: String,
        timeLimit: Number,
        answer: String,
        feedback: String,

        score: {// Add a score field to store the candidate's score for each question
            type: Number,
             default: 0, // Default score is 0, it can be updated after evaluating the candidate's answer
        },
        confidence: {// Add a confidence field to store the AI's confidence level in the candidate's answer
            type: Number,
            default: 0, // Default confidence is 0, it can be updated after evaluating the candidate's answer
        },
        communication: {// Add a communicationSkills field to store the AI's evaluation of the candidate's communication skills based on their answer
            type: Number,
            default: 0, // Default communication skills score is 0, it can be updated after evaluating the candidate's answer
        }, 
        correctness: {
            type: Number, 
            default: 0,
        },
},{ timestamps: true })


const interviewSchema = new mongoose.Schema(
    { 
        // Links this entire session securely to your logged-in candidate profile in the database, ensuring that all interactions and data are properly associated with the correct user account.
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        experience: {
           type: String,
           required: true,
        },
        mode: {
            type: String,
            enum: ["HR", "Technical"], 
            required: true,
        },
        resumeText: {
            type: String,
        },

        resumeData: {
            skills: [String],
            projects: [{ title: String, description: String }],
            education: String
        },

        questions: [questionSchema], // Array of questions with answers

        // Final report scores (filled after interview ends)
        finalScore: {
            type: Number,
            default: 0,
        },

        // Interview status
        status: {
            type: String,
            enum: ["Incomplete", "Completed"],
            default: "Incomplete"
        }

},{ timestamps: true })

export const Interview = mongoose.model("Interview", interviewSchema);