// src/pages/InterviewSession.jsx
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// 🚀 BOTH SEPARATE HOOKS IMPORTED CLEANLY
import { useInterviewSession } from "../hooks/useInterviewSession.js";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder.js";
import useInterviewIntegrity from "../hooks/useInterviewIntegrity.js";

import AIAvatar from "../components/Interview/Session/AIAvatar.jsx";
import QuestionCard from "../components/Interview/Session/QuestionCard.jsx";
import AnswerPanel from "../components/Interview/Session/AnswerPanel.jsx";
import FeedbackCard from "../components/Interview/Session/FeedbackCard.jsx";
import ProgressBar from "../components/Interview/Session/ProgressBar.jsx";
import EndingOverlay from "../components/Interview/Session/EndingOverlay.jsx";

import FadeIn from "../components/ui/FadeIn.jsx";
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";
import { TbAlertCircle } from "react-icons/tb";

export default function InterviewSession() {
  // 🚀 URL se 'sessionId' extract ho raha hai
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routerPassedQuestions = location.state?.questions || [];

  const glowData = useCursorGlow() || {};
  const { x, y, ...cursorHandlers } = glowData;

  // ── 🚀 HOOK 1: CORE INTERVIEW ENGINE ──
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
    // 🚨 Extract actual dynamic evaluation data if returned by your session hook
    interviewData,
  } = sessionEngine;

  // ── 🚀 HOOK 2: SEPARATE VOICE ENGINE ──
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

  // ── 🚀 HOOK 3: FIXED INTEGRITY HOOK CALL WITH CORRECT PARAMETER ──
  const { integrityStats } = useInterviewIntegrity(sessionId);

  // Keep a reference of mutable stats to prevent closure staleness inside useEffect
  const statsRef = useRef();
  statsRef.current = integrityStats;

  // ── 🎯 THE JUGAD INTERCEPTOR: LINKING STATE ROUTING WITHOUT DB SCHEMA ──
  useEffect(() => {
    // Jab core engine bolta hai ki interview is ending (isEnding === true)
    if (isEnding) {
      console.log(
        "🎯 INTERCEPTING ROUTE: Sending live telemetry data to report page...",
      );

      const currentStats = statsRef.current || {};

      // 🚀 EXACT STRUCTURAL MAPPING AS EXPECTED BY YOUR REPORT PAGE
      const syntheticReportPayload = {
        finalScore: interviewData?.finalScore || feedback?.score || 1.2,
        confidence: interviewData?.confidence || 1.2,
        communication: interviewData?.communication || 1.2,
        correctness: interviewData?.correctness || 0.8,

        questionWiseScore:
          interviewData?.questions || routerPassedQuestions || [],

        metaData: {
          role: location.state?.role || "Full Stack Developer",
          mode: location.state?.mode || "Technical",
          totalQuestions: totalQuestions || 5,
          totalAnswered: currentIndex + 1,
        },
        createdAt: new Date().toISOString(),

        // 🌟 YEH HAI WOH KEYS JO INTEGRITY REPORT CARD PADHEGA:
        integrityScore: currentStats.score ?? 100,
        tabSwitchesCount: currentStats.tabSwitches ?? 0,
        copyCount: currentStats.copyAttempts ?? 0,
        pasteCount: currentStats.pasteBlocked ?? 0,
        timeAwaySeconds: currentStats.timeAway ?? 0,
      };

      // Forced direct dispatch with dynamic state object
      navigate(`/interview/report/${sessionId}`, {
        state: { report: syntheticReportPayload },
        replace: true, // Taki user back dabakar wapas chalte interview me na ghuse
      });
    }
  }, [isEnding, sessionId, navigate, interviewData]);

  // ── 🤝 THE BRIDGE: CONNECTING VOICE STATE TO API UTILITY ──
  const onFinalAnswerSubmit = async (typedOrVoiceText) => {
    stopRecording();

    // interface se direct typedText pass ho raha hai ya phir mic ka voice transcript
    const finalAnswer = typedOrVoiceText || transcript;

    console.log("UI Pipeline -> Sending final answer context:", finalAnswer);

    console.log("=========================================");
    console.log("🚨 HOOK INTEGRITY TELEMETRY CAPTURED:");
    console.log("Tab Switches Count :", integrityStats?.tabSwitches);
    console.log("Copy Attempts Count:", integrityStats?.copyAttempts);
    console.log("Paste Blocked Count:", integrityStats?.pasteBlocked);
    console.log("Time Away (Seconds):", integrityStats?.timeAway);
    console.log("Calculated Score    :", integrityStats?.score);
    console.log("=========================================");

    // 🚀 Passing both textual answer and security monitoring metrics to hook pipeline
    await handleSubmitAnswer(finalAnswer, integrityStats);

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
                  onNext={handleNextQuestion}
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

              {/* 🚀 SUBMIT RE-WIDGET LINKED */}
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
              />
            </div>
          </div>
        </FadeIn>
      </div>

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
