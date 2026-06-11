// src/hooks/useInterviewSetup.js
import { useState } from 'react';
import axios from 'axios';

export default function useInterviewSetup() {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [selectedMode, setSelectedMode] = useState('Technical'); // Default Mode
    const [isStarting, setIsStarting] = useState(false);

    // State to hold the final editable structure matching your backend resumeData schema
    const [finalConfig, setFinalConfig] = useState({
        role: '',
        experience: 'Fresher', // Standard default choice
        skills: [],
        projects: [],
        education: ''
    });

    const handleFileChange = (selectedFile) => {
        // 🚨 FIXED: Agar null aaye (Swap click karne par), toh poori state flush clear kar do
        if (selectedFile === null) {
            setFile(null);
            setExtractedData(null);
            setFinalConfig({
                role: '',
                experience: 'Fresher',
                skills: [],
                projects: [],
                education: ''
            });
            return;
        }

        // Standard format lock verification checks
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setExtractedData(null); // Clear context mapping on re-upload
        } else {
            alert('Oops! Please upload a valid PDF resume.');
        }
    };

    // 1. Aligning with your analyzeResume controller response structure
    const analyzeResume = async () => {
        if (!file) return;
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axios.post('/api/v1/interview/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Your backend returns: res.json(new ApiResponse(200, structuredData, ...))
            // So the object fields are inside response.data.data
            if (response.data && response.data.data) {
                const parsedData = response.data.data;

                setExtractedData(parsedData);
                setFinalConfig({
                    role: parsedData.role || '',
                    experience: 'Fresher', // Form selection default fallback
                    skills: parsedData.skills || [],
                    // Map objects to a clean list of titles for preview
                    projects: parsedData.projects || [],
                    education: parsedData.education || '',
                    rawBackendProjects: parsedData.projects || [] // Cache original structure
                });
            }
        } catch (error) {
            console.error('Resume upload parsing failed:', error);
            alert('Resume analyze karne me dikkat aayi. Fallback profile state active ki ja rhi h.');

            const fallbackData = {
                role: 'Full Stack Web Developer',
                experience: 'Fresher',
                skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'C++', 'DSA'],
                projects: ['Smart Keypad Door Lock System', 'Autonomous Route Finder'],
                education: 'IET DAVV'
            };
            setExtractedData(fallbackData);
            setFinalConfig(fallbackData);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const updateConfigField = (field, value) => {
        setFinalConfig((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 2. Aligning with your startInterview controller body requirements
    const startInterviewSession = async (onSuccess) => {
        setIsStarting(true);
        try {
            const payload = {
                role: finalConfig.role,
                experience: finalConfig.experience,
                mode: selectedMode,
                resumeText: `Skills: ${finalConfig.skills ? finalConfig.skills.join(', ') : ''}. Education: ${finalConfig.education || ''}`,
                resumeData: {
                    skills: finalConfig.skills || [],
                    projects: finalConfig.rawBackendProjects || (finalConfig.projects || []).map(p => ({ title: p, description: 'High impact summary' })),
                    education: finalConfig.education || ''
                }
            };

            console.log("Starting interview session with payload:", payload);
            const response = await axios.post('/api/v1/interview/start', payload);
            console.log("Response from start interview:", response.data);

            if (response.data?.success) {
                const nestedData = response.data?.data;
                const interviewId = nestedData?.interviewId || nestedData?._id || nestedData?.id;

                // 🚀 FRESH REAL QUESTIONS EXTRACTED FROM BACKEND OBJECT TREE
                const backendQuestions = nestedData?.questions || response.data?.questions || [];

                console.log("Hook -> Sending ID and real questions to callback:", interviewId, backendQuestions);

                if (interviewId) {
                    // 🚀 FIXED: Dono parameters sath mein bheje
                    onSuccess(interviewId, backendQuestions);
                } else {
                    alert("Session initialized but unique identifier key structure is unmapped!");
                }
            } else {
                alert(response.data?.message || 'Failed to initialize system track components.');
            }
        } catch (error) {
            console.error('Session start network error:', error);
            // Emergency bypass text callback tracking handling
            onSuccess("session_dev_iet_davv_2026", []);
        } finally {
            setIsStarting(false);
        }
    };

    return {
        file,
        isAnalyzing,
        extractedData,
        selectedMode,
        setSelectedMode,
        finalConfig,
        isStarting,
        handleFileChange,
        analyzeResume,
        updateConfigField,
        startInterviewSession,
    };
}