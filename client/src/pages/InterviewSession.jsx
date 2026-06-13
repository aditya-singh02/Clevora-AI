// src/pages/InterviewSession.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// BOTH SEPARATE HOOKS IMPORTED CLEANLY
import { useInterviewSession } from "../hooks/useInterviewSession.js";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder.js";
import { useIntegrity } from "../hooks/useIntegrity.js";

import AIAvatar from "../components/Interview/Session/AIAvatar.jsx";
import QuestionCard from "../components/Interview/Session/QuestionCard.jsx";
import AnswerPanel from "../components/Interview/Session/AnswerPanel.jsx";
import FeedbackCard from "../components/Interview/Session/FeedbackCard.jsx";
import ProgressBar from "../components/Interview/Session/ProgressBar.jsx";
import EndingOverlay from "../components/Interview/Session/EndingOverlay.jsx";
import IntegrityWarning from "../components/Interview/Session/IntegrityWarning.jsx"; // 🚀 NEW COMPONENT FOR VIOLATION TOASTS

import FadeIn from "../components/ui/FadeIn.jsx";
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";
import { TbAlertCircle } from "react-icons/tb";

export default function InterviewSession() {
  // URL se 'sessionId' extract ho raha hai
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routerPassedQuestions = location.state?.questions || [];

  const glowData = useCursorGlow() || {};
  const { x, y, ...cursorHandlers } = glowData;

  // ──  HOOK 1: CORE INTERVIEW ENGINE ──
  const sessionEngine = useInterviewSession({
    interviewId: sessionId,
    questions: routerPassedQuestions,
  });

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isSubmitting,
    isEnding,
    feedback,
    showFeedback,
    timeLeft,
    handleSubmitAnswer,
    handleNextQuestion,
    handleEndInterview,
    // Extract actual dynamic evaluation data if returned by your session hook
    interviewData,
  } = sessionEngine;

  // ── HOOK 2: SEPARATE VOICE ENGINE ──
  const recorderEngine = useVoiceRecorder();

  const {
    isRecording,
    transcript,
    interimText,
    waveHeights,
    setTranscript,
    toggleRecording,
    stopRecording,
    clearTranscript,
  } = recorderEngine;

  const [warning, setWarning] = useState(null);

  const {
    integrityScore,
    totalViolations,
    violations,
    startTracking,
    stopTracking,
    getReport,
  } = useIntegrity({
    onViolation: (v) => setWarning(v), // FIXED: Direct bridge handler linking to live warnings UI toast!
  });

  // 2. Update the Hook call to use the callback
  const statsRef = useRef();
  statsRef.current = { integrityScore, totalViolations, violations };

  const onEndInterview = () => {
    stopTracking();
    const integrityPayload = getReport();
    handleEndInterview(integrityPayload);
  };

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  // ── THE BRIDGE: CONNECTING VOICE STATE TO API UTILITY ──
  const onFinalAnswerSubmit = async (typedOrVoiceText) => {
    stopRecording();

    // interface se direct typedText pass ho raha hai ya phir mic ka voice transcript
    const finalAnswer = typedOrVoiceText || transcript;
    console.log("🎤 Final Answer Submitted:", finalAnswer); // Debug log to verify answer content

    const currentIntegrityReportPayload = getReport();
    // Passing textual answer context alongside dynamic security configurations to pipeline
    await handleSubmitAnswer(finalAnswer, currentIntegrityReportPayload);
    clearTranscript();
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center text-slate-400">
        Invalid interview session.
      </div>
    );
  }

  if (isEnding) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Compiling Metrics & Generating Report Card...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...cursorHandlers}
      className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Background and Glow Systems */}
      {x !== undefined && y !== undefined && (
        <div
          className="absolute pointer-events-none rounded-full opacity-15 blur-[150px] mix-blend-screen z-0 hidden sm:block"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: "650px",
            height: "650px",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralBg />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 my-auto py-4 space-y-6">
        <FadeIn className="space-y-6">
          {/* Header Row Progress Bar Container */}
          <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-white/[0.05] rounded-2xl backdrop-blur-xl shadow-xl">
            <div className="w-full">
              <ProgressBar
                currentIdx={currentIndex}
                totalQuestions={totalQuestions || 5}
              />
            </div>
          </div>

          {/* Main Operational Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column Stack */}
            <div className="lg:col-span-5 space-y-4">
              <AIAvatar
                currentQuestion={currentQuestion}
                isSubmitting={isSubmitting}
                timeLeft={timeLeft}
              />

              {showFeedback && feedback && (
                <FeedbackCard
                  feedback={feedback.feedback}
                  score={feedback.score}
                  onNext={() => {
                    if (sessionEngine.isLastQuestion) {
                      onEndInterview();
                    } else {
                      handleNextQuestion();
                    }
                  }}
                />
              )}
            </div>

            {/* Right Column Stack */}
            <div className="lg:col-span-7 space-y-6">
              {currentQuestion ? (
                <QuestionCard
                  question={currentQuestion}
                  currentIdx={currentIndex}
                  totalQuestions={totalQuestions || 5}
                />
              ) : (
                <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 text-xs text-slate-500 font-mono">
                  Loading evaluation script metrics...
                </div>
              )}

              {/* SUBMIT RE-WIDGET LINKED */}
              <AnswerPanel
                isRecording={isRecording}
                transcript={transcript + (interimText ? interimText : "")}
                interimText={interimText}
                setTranscript={setTranscript}
                waveHeights={waveHeights}
                startRecording={toggleRecording}
                stopRecording={toggleRecording}
                onSubmit={onFinalAnswerSubmit}
                isSubmitting={isSubmitting}
                onPasteBlocked={() => {
                  // Manually trigger a warning if paste is attempted
                  setWarning({ type: "paste", sub: "Paste is blocked!" });
                }}
              />
            </div>
          </div>
        </FadeIn>
      </div>

      <IntegrityWarning warning={warning} onDismiss={() => setWarning(null)} />

      {/* Security Footer Tracking Controls */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between opacity-40 border-t border-white/[0.03] pt-4 mt-6 relative z-10">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
          <TbAlertCircle size={13} />
          Active anti-cheat evaluation shield active.
        </p>

        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to quit? Current analytics state will expire.",
              )
            ) {
              navigate("/interview/setup");
            }
          }}
          className="text-[10px] font-black uppercase text-red-500/80 hover:text-red-400 tracking-wider transition-colors"
        >
          Quit Interview
        </button>
      </div>

      <EndingOverlay isVisible={isEnding} />
    </div>
  );
}
