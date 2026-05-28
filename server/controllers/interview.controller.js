import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import askAI from "../services/openRouter.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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
    catch(error){
        console.error("Error analyzing resume:", error);

        if(req.file && fs.existsSync(req.file.path)) { // Check if the file exists before trying to delete it to avoid potential errors if the file was not created or has already been deleted.
            fs.unlinkSync(req.file.path);
        }

        throw new ApiError(500, "Failed to analyze resume");
    }
});

export { analyzeResume }; 