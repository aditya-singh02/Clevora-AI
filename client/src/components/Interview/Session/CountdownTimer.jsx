// src/components/Interview/Session/CountdownTimer.jsx
import React from "react";
import { TbClock } from "react-icons/tb";

export default function CountdownTimer({ timeLeft, totalDuration }) {
  // Simple calculation for dynamic stroke progress circles
  const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;

  const isCritical = timeLeft < 15; // Changes frame color if time running out

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/60 border border-white/[0.04] backdrop-blur-md shadow-inner">
      <div
        className={`p-2 rounded-lg ${isCritical ? "bg-red-500/10 text-red-400 animate-pulse" : "bg-indigo-500/10 text-indigo-400"}`}
      >
        <TbClock size={18} />
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Time Remaining
        </span>
        <span
          className={`text-base font-mono font-black transition-colors ${
            isCritical ? "text-red-400 animate-pulse" : "text-slate-200"
          }`}
        >
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
