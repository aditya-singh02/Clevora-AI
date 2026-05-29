import axios from 'axios';
import {ApiError} from '../utils/ApiError.js';
import dotenv from 'dotenv';

dotenv.config();

//askAi is a function that takes a message as input and sends it to the OpenRouter API to get a response. It validates the input and handles errors appropriately.
//flow ->
//1. Validate that the input message is a non-empty array.
//2. Send a POST request to the OpenRouter API with the message and the required headers.
//3. Extract the AI response from the API response and validate that it is not empty or just whitespace.
//4. Return the AI response if everything is successful, or throw an ApiError if there are any issues.

const askAI = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) { // Validate that message is a non-empty array 
            throw new ApiError(400, 'Invalid input: messages must be a non-empty array');
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            // model: 'openai/gpt-4o-mini',
            // model: 'openrouter/free',
            model: 'openai/gpt-oss-120b:free' ,
            messages: messages,
        },
             {
                headers: {
                     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

        const aiResponse = response?.data?.choices?.[0]?.message?.content; 

        if(!aiResponse || !aiResponse.trim()) { // Validate that the response is not empty or just whitespace
            throw new ApiError(500, 'AI response is empty or invalid');
        }
            return aiResponse;
            
    } catch (error) {
        console.error('OpenRouter API error:', error.response?.data || error.message || error); 
        throw new ApiError(500, 'Failed to get response from OpenRouter API');
    }
}


export default askAI
