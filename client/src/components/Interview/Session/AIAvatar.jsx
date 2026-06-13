import React, { useEffect, useRef, useState } from "react";

import femaleIdle from "../../../assets/videos/femaleIdle.mp4";
import femaleSpeaking from "../../../assets/videos/femaleSpeaking.mp4";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// How it works:
// 1. when currentQuestion changes, useEffect triggers and speaks the question using Web Speech API.
// 2. During speaking, `isSpeaking` state is true, which switches the video source to the speaking clip and shows the "Interviewer Speaking..." badge.
// 3. Once speaking ends, `isSpeaking` becomes false, switching back to the idle clip and updating the badge accordingly.
// 4. The circular progress bar at the bottom visually represents the remaining time for answering the question, changing color and pulsing when time is critically low.
export default function AIAvatar({ currentQuestion, isSubmitting, timeLeft }) {
  const videoRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const totalDuration = currentQuestion?.timeLimit || 60;

  useEffect(() => {
    if (!currentQuestion?.question) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);

    const voices = window.speechSynthesis.getVoices();
    const interviewerVoice =
      voices.find(
        (v) => v.lang.includes("en-US") && v.name.includes("Google"),
      ) || voices[0];
    if (interviewerVoice) utterance.voice = interviewerVoice;

    utterance.rate = 0.95;

    // 🎬 BOLTE WAQT: SPEAKING CLIPS TRIGGER KARO
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    // 🤫 BOLNA KHATAM: IDLE CLIPS PAR AUTOMATIC SWAP
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full bg-slate-900/40 border border-white/[0.05] rounded-2xl p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-between relative overflow-hidden min-h-[460px] h-full">
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-indigo-500 animate-pulse" : "bg-slate-600"}`}
        />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
          {isSpeaking
            ? "Interviewer Speaking..."
            : isSubmitting
              ? "Evaluating..."
              : "AI Interviewer Idle"}
        </span>
      </div>

      {/* CORE FRAME CONTAINER */}
      <div className="w-full h-full rounded-xl overflow-hidden border border-white/[0.05] bg-slate-950 shadow-2xl relative flex items-center justify-center mt-6">
        <video
          ref={videoRef}
          // DYNAMIC SOURCE SWITCH: Bolte waqt muh hilega, chup rehte waqt normal sir hilaayega loop par
          src={isSpeaking ? femaleSpeaking : femaleIdle}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover min-h-[260px] max-h-[300px]"
        />
      </div>

      {/* Circular Progress Timer Footer */}
      <div className="w-full flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4 bg-slate-950/20 px-3 py-2 rounded-xl">
        <div className="text-left">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Time Remaining
          </p>
          <p className="text-xs font-black text-slate-300 uppercase mt-0.5 tracking-wide">
            Keep track of pace
          </p>
        </div>

        <div className="w-20 h-20 relative font-mono font-black text-xs pr-1">
          <CircularProgressbar
            value={timeLeft}
            max={totalDuration}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textColor: timeLeft <= 10 ? "#f87171" : "#e2e8f0",
              pathColor: timeLeft <= 10 ? "#ef4444" : "#6366f1",
              trailColor: "#1e293b",
              strokeLinecap: "round",
              textSize: "20px",
            })}
            className={timeLeft <= 10 ? "animate-pulse" : ""}
          />
        </div>
      </div>
    </div>
  );
}
