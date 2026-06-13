import { useState, useRef, useCallback, useEffect } from 'react';

export function useVoiceRecorder() {
    const [transcript, setTranscript] = useState('');      // Final speech text
    const [interimText, setInterimText] = useState('');      // Live partial speech
    const [isRecording, setIsRecording] = useState(false);
    const [waveHeights, setWaveHeights] = useState(Array(15).fill(4));

    const recognitionRef = useRef(null);
    const intervalRef = useRef(null);

    // ── Web Speech API Initialization ──────────────────────────────
    const initRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalText = '';
            let interimPart = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript + ' ';
                } else {
                    interimPart += result[0].transcript;
                }
            }

            if (finalText) setTranscript(prev => prev + finalText);
            setInterimText(interimPart);
        };

        recognition.onerror = (e) => {
            console.error('Speech recognition error:', e.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            setInterimText('');
        };

        return recognition;
    }, []);

    // ── Simulated Waveform Animation Loop ───────────────────────────
    useEffect(() => {
        if (isRecording) {
            intervalRef.current = setInterval(() => {
                setWaveHeights(
                    Array.from({ length: 15 }, () => Math.floor(Math.random() * 55) + 10)
                );
            }, 100);
        } else {
            clearInterval(intervalRef.current);
            setWaveHeights(Array(15).fill(4));
        }
        return () => clearInterval(intervalRef.current);
    }, [isRecording]);

    // ── Actions ─────────────────────────────────────────────────────
    const startRecording = useCallback(() => {
        if (isRecording) return;
        const r = initRecognition();
        if (!r) {
            alert('Speech recognition not supported. Please use Chrome browser.');
            return;
        }
        recognitionRef.current = r
        r.start();
        setIsRecording(true);
    }, [isRecording, initRecognition]);

    const stopRecording = useCallback(() => {
        if (!isRecording) return;
        recognitionRef.current?.stop();
        setIsRecording(false);
        setInterimText('');
    }, [isRecording]);

    const toggleRecording = useCallback(() => {
        if (isRecording) stopRecording();
        else startRecording();
    }, [isRecording, startRecording, stopRecording]);

    const clearTranscript = useCallback(() => {
        setTranscript('');
        setInterimText('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            recognitionRef.current?.stop();
        };
    }, []);

    return {
        isRecording,
        transcript,
        interimText,
        waveHeights,
        setTranscript,
        toggleRecording,
        startRecording,
        stopRecording,
        clearTranscript
    };
}