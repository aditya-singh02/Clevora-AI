// src/pages/InterviewSetup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useInterviewSetup from "../hooks/useInterviewSetup.js";
import {useCursorGlow} from "../hooks/useCursorGlow.js";

// 🚀 SAARI 5 COMPONENTS LINES SE IMPORTED
import StepIndicator from "../components/Interview/Setup/StepIndicator.jsx";
import ResumeUploader from "../components/Interview/Setup/ResumeUploader.jsx";
import ResumePreview from "../components/Interview/Setup/ResumePreview.jsx";
import ModeSelector from "../components/Interview/Setup/ModeSelector.jsx";
import ConfirmStart from "../components/Interview/Setup/ConfirmStart.jsx";

import FadeIn from "../components/ui/FadeIn.jsx";
import {NeuralBg} from "../components/ui/NeuralBg.jsx";
import { TbShieldLock, TbSettingsAutomation } from "react-icons/tb";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const glowProps = useCursorGlow() || {};

  const {
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
  } = useInterviewSetup();

 const handleSessionSuccess = (interviewId, backendQuestions) => {
   console.log(
     "Page Level Callback -> Received questions from hook:",
     backendQuestions,
   );

   // Agar hook se real backend questions aaye hain toh unhe lo
   const cleanQuestions = backendQuestions || [];

   // Router state ke andar parcel pack karke bhej do
   navigate(`/interview/session/${interviewId}`, {
     state: { questions: cleanQuestions },
   });
 };
  return (
    <div
      {...glowProps}
      className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Cursor Glow Effect */}
      {glowProps?.x !== undefined && glowProps?.y !== undefined && (
        <div
          className="absolute pointer-events-none rounded-full opacity-15 blur-[150px] mix-blend-screen z-0 hidden sm:block"
          style={{
            left: `${glowProps.x}px`,
            top: `${glowProps.y}px`,
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralBg />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 my-auto py-4">
        <FadeIn className="space-y-8">
          {/* ⚡ NEW: STEP 1 PROGRESS INDICATOR AT THE TOP */}
          <StepIndicator
            activeStep={!file ? 1 : finalConfig?.role || extractedData ? 3 : 2}
          />

          {/* Top Main Heading Header */}
          <div className="space-y-3 text-center max-w-2xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <TbSettingsAutomation
                className="animate-spin"
                style={{ animationDuration: "6s" }}
              />{" "}
              Mock Interview Setup
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-wider text-white uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Setup Your Interview
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Upload your resume to generate a customized mock interview session
              based on your real experience and projects.
            </p>
          </div>

          {/* TWO-COLUMN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: RESUME CONTROLS */}
            <div className="lg:col-span-6 flex flex-col">
              {!extractedData ? (
                <div className="bg-slate-900/40 border border-white/[0.05] rounded-2xl p-4 backdrop-blur-xl shadow-2xl min-h-[400px] flex flex-col justify-center">
                  <ResumeUploader
                    file={file}
                    isAnalyzing={isAnalyzing}
                    onFileChange={handleFileChange}
                    onAnalyze={analyzeResume}
                  />
                </div>
              ) : (
                <ResumePreview
                  config={finalConfig}
                  onUpdateField={updateConfigField}
                  file={file}
                  onReset={() => handleFileChange(null)}
                />
              )}
            </div>

            {/* RIGHT COLUMN: INTERVIEW CRITERIA & START LAUNCHER */}
            <div className="lg:col-span-6 flex flex-col">
              {extractedData ? (
                // Clean flex gap rendering to ensure absolutely no extra white spaces drop in between components
                <div className="space-y-6 flex flex-col justify-start h-full animate-fadeIn">
                  <ModeSelector
                    selectedMode={selectedMode}
                    onModeChange={setSelectedMode}
                  />

                  {/* 🚀 NEW: CONFIRM START COMPONENT INTEGRATED */}
                  <ConfirmStart
                    selectedMode={selectedMode}
                    isStarting={isStarting}
                    onStart={() => {
                      console.log(
                        "ConfirmStart button clicked! Selected Mode:",
                        selectedMode,
                      ); // 👈 Browser Inspect Console me check karne ke liye log

                      // Check karo ki tumhare hook ka function arguments mangta hai ya nahi:
                      if (typeof startInterviewSession === "function") {
                        startInterviewSession(handleSessionSuccess);
                      } else {
                        console.error(
                          "startInterviewSession function hook se nahi mil raha hai!",
                        );
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-slate-900/10 p-8 flex flex-col items-center justify-center text-center backdrop-blur-md min-h-[400px] group">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-all duration-300 mb-6 shadow-inner">
                    <TbShieldLock size={26} />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 tracking-widest uppercase">
                    Options Locked
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-2">
                    Please upload and verify your resume first to unlock
                    interview options.
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Footer System Status Check */}
      <div className="flex items-center justify-center gap-2 opacity-30 py-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-xs font-black font-mono text-slate-500 uppercase tracking-widest">
          Secure Prep Environment Active
        </p>
      </div>
    </div>
  );
}
