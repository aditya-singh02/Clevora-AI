import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import askAI from "../services/openRouter.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Interview } from "../models/interview.model.js";


//a. Analyze Resume Controller: This controller function is responsible for handling the analysis of a resume uploaded by the user. It performs several key steps:
//1. It checks if a file was uploaded using Multer middleware. If not, it throws an error indicating that a resume file is required.
//2. It reads the uploaded PDF file into a buffer and converts it into a Uint8Array format that can be processed by the PDF parsing library (pdfjsLib).
//3. It loads the PDF document using pdfjsLib and extracts text from each page of the PDF, concatenating it into a single string.
//4. It cleans up the extracted text by replacing multiple whitespace characters with a single space and trimming any leading or trailing whitespace.
//5. It prepares a messages array to send to the OpenRouter API, including a system message with instructions for extracting structured data from the resume and a user message containing the actual resume text.
//6. It calls the askAI function to send the messages to the OpenRouter API and receive the AI response, which is expected to be in JSON format.
//7. It parses the AI response into a JavaScript object and deletes the uploaded file from the server to free up storage space.
//8. Finally, it returns a successful response with the structured data extracted from the resume or handles any errors that occur during the process.

const analyzeResume = asyncHandler(async (req, res) => {

    try {
        // 1. Check if the file was uploaded by Multer
        if (!req.file) {
            throw new ApiError(400, "Resume file is required");
        }

        // 2. Read the uploaded PDF file
        const filePath = req.file.path;

        // 3. Read the file into a buffer (means we are reading the file into memory as a binary data that can be processed by the PDF parsing library to extract text and other information from the PDF file.)
        const fileBuffer = await fs.promises.readFile(filePath);
        const uint8Array = new Uint8Array(fileBuffer);

        // 4. Load the PDF document using pdfjsLib
        const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        // 5. Extract text from each page of the PDF
        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();

            const pageText = textContent.items.map(item => item.str).join(" "); // The textContent.items is an array of text items extracted from the PDF page. Each item has a str property that contains the actual text string. The map function is used to create a new array of these text strings, and then join(" ") is used to concatenate them into a single string for the entire page, with spaces in between.
            resumeText += pageText + "\n";
        }

        //6. Clean up the extracted text by replacing multiple whitespace characters (including newlines) with a single space and trimming any leading or trailing whitespace. This helps to ensure that the resume text is in a more readable and consistent format before it is sent to the AI for analysis.
        resumeText = resumeText.replace(/\s+/g, " ").trim();

        //7. Prepare the messages array to send to the OpenRouter API. The system message provides instructions to the AI on how to extract structured data from the resume, specifying the expected JSON format for the response. The user message contains the actual resume text that was extracted from the PDF, which the AI will analyze based on the instructions provided in the system message.
        const messages = [
            {
                role: "system",
                content: `
            Extract structured data from resume.
            
            Return Strictly in JSON format with the following fields:

            {
            "role": string,
            "experience" : [
                {
                    "company": "Company Name",
                    "designation": "Job Title/Role",
                    "duration": "Start Date - End Date"
                }
            ],
           "projects": [
                {
                    "title": "Name of the project",
                    "description": "High impact summary"
                }
            ],
            "skills": ["skill1", "skill2"],
            "education": string
            }
        CRITICAL PARSING RULES:
        1. If a section like 'experience' or 'projects' is entirely missing from the resume text, return it as a clean empty array []—NEVER omit the key and NEVER use null.
        2. Clean and deduce technical skills from both project summaries and dedicated experience descriptions. Ensure duplicates are removed.
        `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        //8. Call the askAI function to send the messages to the OpenRouter API and get the AI response. 
        const aiResponse = await askAI(messages);

        const clean = aiResponse.replace(/```json|```/g, "").trim()
        const structuredData = JSON.parse(clean); // Parse the AI response from a JSON string into a JavaScript object so that it can be easily accessed and manipulated in the code.

        fs.unlinkSync(filePath); // Delete the uploaded file from the server after processing to free up storage space and maintain security.

        return res
            .status(200)
            .json(new ApiResponse(200, structuredData, "Resume analyzed successfully"));
    }
    catch (error) {
        console.error("Error analyzing resume:", error);

        if (req.file && fs.existsSync(req.file.path)) { // Check if the file exists before trying to delete it to avoid potential errors if the file was not created or has already been deleted.
            fs.unlinkSync(req.file.path);
        }

        throw new ApiError(500, `Failed to analyze resume: ${error.message}`);
    }
});


// b. startInterview Controller: This controller function is responsible for generating interview questions based on the candidate's profile and resume information and creating a new interview session. It performs several key steps:
//1. It validates the required fields (role, experience, mode) from the request body and checks if the user has enough credits to generate questions.
//2. It builds a user prompt string that includes the candidate's role, experience, interview mode, skills, projects, and resume details to provide context for the AI.
//3. It prepares a messages array with a system message containing detailed instructions for the AI on how to generate relevant and appropriately difficult interview questions based on the candidate's profile.
//4. It calls the askAI function to send the messages to the OpenRouter API and receive the AI response, which is expected to be an array of questions in JSON format.
//5. It formats the questions received from the AI and creates a new "interview" record in the database with the generated questions and associated user information.
//6. Finally, it deducts credits from the user's account after successfully creating the interview session and returns a successful response with the interview details or handles any errors that occur during the process
const startInterview = asyncHandler(async (req, res) => {


    let { role, experience, mode, resumeText, resumeData } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    // Validate required fields
    if (!role || !experience || !mode) {
        throw new ApiError(400, "Role, experience and mode are required")
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.credits < 20) {
        throw new ApiError(400, "Insufficient credits. Please purchase more to continue.")
    }

    // Build skills + projects string for AI context
    const skillsList = resumeData?.skills?.join(", ") || "Not specified"

    const projectsList = resumeData?.projects // it checks if resumeData and resumeData.projects exist, then it maps over the projects array to create a string representation of each project in the format "Project Title: Project Description". Finally, it joins all the project strings together with newline characters. If there are no projects, it defaults to "Not specified".
        ?.map(p => `${p.title}: ${p.description}`)
        .join("\n") || "Not specified"

    const safeResume = resumeText.trim() || "None";

    const userPrompt = `
    Role: ${role}
    Experience: ${experience}
    Mode: ${mode}
    Skills: ${skillsList}
    Projects: ${projectsList}
    Resume : ${safeResume}
    `;

    if (!userPrompt.trim()) {
        throw new ApiError(400, "Prompt content is empty. Please provide valid input.")
    }

    const messages = [
        {
            role: "system",
            content: `
            You are a professional ${mode} interviewer at a top tech company
            Speak in simple, natural english and avoid robotic or formal language to create a comfortable interview atmosphere for the candidate as if you are directly interviewing them.

             Generate exactly 5 interview questions based on the candidate's profile.

             Strictly return the response in JSON format as an array of questions, without any additional text or explanations.
             Strict Rules:
                - Each question should be unique and not overlap in content with the others.
                - The questions should be relevant to the candidate's experience level and the role they are applying for.
                - Each question must contain between 15 to 30 words to ensure they are detailed enough to evaluate the candidate effectively.
                - Each question must be a single, clear sentence that can be easily understood by the candidate.
                - Do not number them.
                - Do not add explanations or justifications for the questions.
                - Do NOT add extra text before or after.
                - Keep language simple and conversational.
                - Questions must feel practical and realistic.

                Each question must follow this exact structure:
                [
                    {
                        "question": "Your question here?",
                        "difficulty": "easy",
                        "timeLimit": 60
                    }
                ]
                 Difficulty must be: "easy", "medium" or "hard"
      
                    timeLimit rules (in seconds):
                    - easy   → 60  seconds
                    - medium → 120 seconds
                    - hard   → 180 seconds

                Difficulty Guidelines:
                - For Junior level: Focus on fundamental concepts, practical applications, and problem-solving skills relevant to the role. Avoid overly complex or theoretical questions.
                - For Mid level: Include a mix of conceptual questions and practical scenarios that require deeper understanding and application of knowledge. Questions can be moderately complex.
                - For Senior level: Emphasize strategic thinking, system design, and advanced problem-solving. Questions can be complex and may involve multiple steps or considerations.

                Difficulty should be aligned with the candidate's experience level, ensuring that junior candidates are not overwhelmed and senior candidates are adequately challenged.

                Difficulty distribution:
                    - Question 1: easy   (warm-up)
                    - Question 2: easy   (basic concept)
                    - Question 3: medium (applied knowledge)
                    - Question 4: medium (problem solving)
                    - Question 5: hard   (deep understanding / tricky)

                Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
                `
        }
        ,
        {
            role: "user",
            content: userPrompt
        }
    ];

    const aiResponse = await askAI(messages);

    if (!aiResponse || !aiResponse.trim()) {
        throw new ApiError(500, "AI did not return any questions. Please try again.")
    }

    // Clean the AI response by removing any code block markers and trimming whitespace, then parse it as JSON to extract the structured array of questions.
    const clean = aiResponse.replace(/```json|```/g, "").trim()
    const questionsArray = JSON.parse(clean)

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        throw new ApiError(500, "AI failed to generate valid questions. Please try again.")
    }

    //Format the questions 
    const formattedQuestions = questionsArray.map((q) => ({
        question: q.question,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
    }))

    // Create a new interview record in the database with the generated questions and associated user information. This will allow us to track the interview session and the questions that were asked to the candidate.
    const interview = await Interview.create({
        userId: req.user._id,
        role,
        experience,
        mode,
        resumeText: resumeText || "",
        resumeData: {
            skills: resumeData?.skills || [],
            projects: resumeData?.projects || [],
            education: resumeData?.education || ""
        },
        questions: formattedQuestions,
        status: "Incomplete"
    });

    if (!interview) {
        throw new ApiError(500, "Failed to create interview session")
    }

    //  Deduct credits AFTER successful creation
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $inc: { credits: -20 }
        });

    // Clean up the questions array ONLY for the frontend response(Anti - Cheat)
    const questions = interview.questions.map(q => ({
        _id: q._id,
        question: q.question,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit
    }));

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            {
                interviewId: interview._id,
                creditLeft: user.credits,
                userName: user.name,
                questions: questions
            },
            "Interview started successfully"
        ))
});


// After the interview is completed, we will update the interview record with the candidate's answers and the AI's evaluation of those answers, including communication skills and correctness scores. This will allow us to generate a final report for the candidate based on their performance in the interview.
// c. submitAnswer Controller: This controller function is responsible for handling the submission of a candidate's answer to an interview question, evaluating the answer using AI, and updating the interview record with the candidate's response and the AI's evaluation scores and feedback. It performs several key steps:
//1. It validates the required fields (interviewId, questionId, answer, timeTaken) from the request body.
//2. It retrieves the interview record from the database using the provided interview ID and checks if it exists.
//3. It finds the specific question within the interview's questions array using the provided question ID and checks if it exists.
//4. It updates the question with the candidate's answer and time taken to answer, and if the answer is empty or exceeds the time limit, it assigns a score of 0 and provides appropriate feedback.
//5. If the answer is valid, it prepares a messages array to send to the OpenRouter API, including a system message with instructions for evaluating the candidate's answer based on confidence, communication skills, and correctness, and a user message containing the question and the candidate's answer.
//6. It calls the askAI function to send the messages to the OpenRouter API and receive the AI response, which is expected to be in JSON format containing the evaluation scores and feedback.
//7. It updates the question with the candidate's answer and the AI's evaluation scores and feedback, and saves the updated interview record in the database.
//8. Finally, it returns a successful response with the AI's feedback or handles any errors that occur during the process.
const submitAnswer = asyncHandler(async (req, res) => {
    try {
        const { interviewId, questionId, answer, timeTaken } = req.body;

        // Validate required fields
        if (!interviewId || !questionId) {
            throw new ApiError(400, "Interview ID, Question ID are required")
        }
        // Find the interview record in the database using the provided interview ID. This will allow us to update the specific interview session with the candidate's answer and the AI's evaluation.
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new ApiError(404, "Interview session not found")
        }

        // Find the specific question within the interview's questions array using the provided question ID. This will allow us to update the correct question with the candidate's answer and the AI's evaluation.
        const questionIndex = interview.questions.findIndex(q => q._id.toString() === questionId)
        if (questionIndex === -1) {
            throw new ApiError(404, "Question not found in this interview session")
        }

        const currentQuestion = interview.questions[questionIndex];

        // Update the question with the candidate's answer and time taken to answer. This will allow us to keep track of the candidate's responses and how long they took to answer each question, which can be useful for evaluating their performance.
        if (!answer || !answer.trim()) {
            currentQuestion.score = 0;
            currentQuestion.feedback = "You did not provide an answer to this question.";
            currentQuestion.answer = "";

            await interview.save();

            return res
                .status(200)
                .json(new ApiResponse(200,
                    { feedback: currentQuestion.feedback },
                    "Answer submitted successfully"
                ))
        }

        // if the candidate exceeded the time limit for the question, we can automatically assign a score of 0 and provide feedback indicating that they exceeded the time limit.
        if (timeTaken > interview.questions[questionIndex].timeLimit) {
            currentQuestion.score = 0;
            currentQuestion.feedback = "You exceeded the time limit for this question.";
            currentQuestion.answer = answer;

            await interview.save();

            return res
                .status(200)
                .json(new ApiResponse(200,
                    { feedback: currentQuestion.feedback },
                    "Answer submitted successfully"
                ))
        }

        //Ask AI to evaluate the answer
        const messages = [
            {
                role: "system",
                content: `
                You are an expert ${interview.mode} professional human interviewer evaluating a candidate's answer in a real interview.
                Evaluate naturally and fairly, like a real person would.

            Scoring guide (all fields 0-10):
      
                score → overall quality of the answer
                    - 0-3: completely wrong or irrelevant
                    - 4-6: partially correct, missing key points
                    - 7-8: good answer, mostly correct
                    - 9-10: excellent, thorough and accurate

            1. Confidence – Does the answer sound clear, confident, and well-presented? how confidently the answer was delivered
                            - judge based on clarity, directness, and assertiveness of the answer
                         
            2. Communication – Is the language simple, clear, and easy to understand? how clearly the answer was expressed
                            - judge based on structure, clarity, and coherence
                            
            3. Correctness – Is the answer accurate, relevant, and complete?technical/factual accuracy
                            - judge based on how accurate the content is

            Rules:
            - Be realistic and unbiased.
            - Do not give random high scores.
            - If the answer is weak, score low.
            - If the answer is strong and detailed, score high.
            - Consider clarity, structure, and relevance.

            Calculate:
            finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

            Feedback Rules:
            - Write natural human feedback.
            - 10 to 15 words only.
            - Sound like real interview feedback.
            - Can suggest improvement if needed.
            - Do NOT repeat the question.
            - Do NOT explain scoring.
            - Keep tone professional and honest.

            Return ONLY valid JSON in this format:

            {
            "confidence": number,
            "communication": number,
            "correctness": number,
            "finalScore": number,
            "feedback": "short human constructive feedback"
            }   `

            },
            {
                role: "user",
                content: `
                Question: ${currentQuestion.question}
                Answer: ${answer}
                `
            }
        ];

        const aiResponse = await askAI(messages);

        if (!aiResponse || !aiResponse.trim()) {
            throw new ApiError(500, "AI did not return a valid evaluation. Please try again.")
        }

        const clean = aiResponse.replace(/```json|```/g, "").trim()
        const evaluation = JSON.parse(clean);

        // Update the question with the candidate's answer and the AI's evaluation scores and feedback. 
        currentQuestion.answer = answer;
        currentQuestion.confidence = evaluation.confidence;
        currentQuestion.communication = evaluation.communication;
        currentQuestion.correctness = evaluation.correctness;
        currentQuestion.score = evaluation.finalScore;
        currentQuestion.feedback = evaluation.feedback;

        await interview.save();

        return res
            .status(200)
            .json(new ApiResponse(200,
                {
                    feedback: evaluation.feedback, //only return feedback in the response, the frontend can use this to show feedback immediately after each answer submission, while the scores can be used later to generate a final report after the interview is completed.

                    //for testing in postman I return full evalutation 
                    // finalScore: evaluation.finalScore,
                    // confidence: evaluation.confidence,
                    // communication: evaluation.communication,
                    // correctness: evaluation.correctness,
                },
                "Answer submitted successfully"
            ))
    } catch (error) {
        throw new ApiError(500, `Failed to submit answer. Please try again. ${error.message}`)
    }
});


const endInterview = asyncHandler(async (req, res) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId) {
            throw new ApiError(400, "Interview ID is required")
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new ApiError(404, "Interview session not found")
        }

        if (interview.userId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized — This is not your interview")
        }

        if (interview.status === "Completed") {
            return res
                .status(200)
                .json(new ApiResponse(200, interview, "Interview was already marked as completed."));
        }
        // Calculate finalScore
        // Average of all question scores (answered or not)
        const totalQuestions = interview.questions.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q)=>{
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const finalScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;
        const averageConfidence = totalQuestions > 0 ? totalConfidence / totalQuestions : 0;
        const averageCommunication = totalQuestions > 0 ? totalCommunication / totalQuestions : 0;
        const averageCorrectness = totalQuestions > 0 ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore; 
        interview.status = "Completed";
        await interview.save();

        // The frontend can use the finalScore to show an overall rating, while the averageConfidence, averageCommunication, and averageCorrectness can be used to generate a detailed report showing the candidate's strengths and weaknesses in different areas based on their performance in the interview.
        return res
            .status(200)
            .json(new ApiResponse(200, {
                finalScore: Number(finalScore.toFixed(1)), // Round to 1 decimal place for better readability in the report
                confidence: Number(averageConfidence.toFixed(1)),
                communication: Number(averageCommunication.toFixed(1)),
                correctness: Number(averageCorrectness.toFixed(1)),
                questionWiseScore: interview.questions.map(q => ({
                    question: q.question,
                    answer: q.answer,
                    score: q.score || 0,
                    feedback: q.feedback || "No feedback",
                    confidence: q.confidence || 0,
                    communication: q.communication || 0,
                    correctness: q.correctness || 0
                })),
            }, "Interview ended and scored successfully"))
    } catch (error) {
        throw new ApiError(500, `Failed to end interview. Please try again. ${error.message}`)
    }
})


export { analyzeResume, startInterview, submitAnswer, endInterview }; 