import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SERVER = import.meta.env.VITE_SERVER_URL

export function useInterviewSession({ interviewId, questions = [] }) {
    const navigate = useNavigate()

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [isEnding, setIsEnding] = useState(false)
    const [allAnswers, setAllAnswers] = useState([])

    const timerRef = useRef(null)
    const questionStartRef = useRef(Date.now())

    const currentQuestion = questions[currentIndex] || null
    const isLastQuestion = currentIndex === questions.length - 1

    // Init timer when question changes
    useEffect(() => {
        if (!currentQuestion) return
        setTimeLeft(currentQuestion.timeLimit || 60)
        setTimerActive(true)
        setFeedback(null)
        setShowFeedback(false)
        questionStartRef.current = Date.now()
    }, [currentIndex, currentQuestion])

    // 🚀 FIXED: Now accepts integrityStats dynamically from the bridge function
    const handleSubmitAnswer = useCallback(async (answerText, integrityStats = {}) => {
        if (!currentQuestion || isSubmitting) return

        clearInterval(timerRef.current)
        setTimerActive(false)
        setIsSubmitting(true)

        const timeTaken = Math.round((Date.now() - questionStartRef.current) / 1000)

        try {
            const { data } = await axios.post(
                `${SERVER}/api/v1/interview/submit-answer`,
                {
                    interviewId,
                    questionId: currentQuestion._id,
                    answer: answerText.trim(),
                    timeTaken,
                    integrity: integrityStats // Passing logs straight to backend database
                },
                { withCredentials: true }
            )

            const evalResult = data.data

            setAllAnswers(prev => [...prev, {
                questionId: currentQuestion._id,
                question: currentQuestion.question,
                answer: answerText.trim(),
                ...evalResult,
            }])

            setFeedback(evalResult)
            setShowFeedback(true)

        } catch (err) {
            console.error('Submit answer error:', err)
            setFeedback({ feedback: 'Could not evaluate. Moving on.', score: 0 })
            setShowFeedback(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentQuestion, isSubmitting, interviewId])

    // Countdown timer logic
    useEffect(() => {
        if (!timerActive) return
        if (timeLeft <= 0) {
            handleSubmitAnswer("")
            return
        }
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [timerActive, timeLeft, handleSubmitAnswer])

    // Next question routing node handler
    const handleNextQuestion = useCallback(() => {
        if (isLastQuestion) {
            handleEndInterview()
        } else {
            setCurrentIndex(prev => prev + 1)
        }
    }, [isLastQuestion, interviewId])

    // FIXED: Corrected route mapping template string path pattern match
    const handleEndInterview = useCallback(async (integrityReport = null) => {
        setIsEnding(true)
        clearInterval(timerRef.current)

        try {
            const { data } = await axios.post(
                `${SERVER}/api/v1/interview/end`,
                { interviewId, integrityReport },
                { withCredentials: true }
            )

            // Fixed route destination to match App.jsx perfectly
            setTimeout(() => {
                navigate(`/interview/report/${interviewId}`, { state: { report: data.data } });
            }, 2000); // 2 seconds buffer so user sees report card compilation state screen smoothly

        } catch (err) {
            console.error('End interview error:', err)
            // Fallback routing with the correct setup prefix
            navigate(`/interview/report/${interviewId}`)
        }
    }, [interviewId, navigate])

    useEffect(() => {
        return () => clearInterval(timerRef.current)
    }, [])

    return {
        currentQuestion,
        currentIndex,
        totalQuestions: questions.length,
        isSubmitting,
        isEnding,
        feedback,
        showFeedback,
        timeLeft,
        isLastQuestion,
        allAnswers,
        setTimerActive,
        handleSubmitAnswer,
        handleNextQuestion,
        handleEndInterview,
    }
}