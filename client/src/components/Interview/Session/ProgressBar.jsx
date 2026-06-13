import React from "react";

export default function ProgressBar({ currentIdx, totalQuestions }) {
  return (
    <div className="w-full space-y-2">
      {/* Percentage Row Track */}
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>Session Progression Matrix</span>
        <span>{Math.round((currentIdx / totalQuestions) * 100)}% Complete</span>
      </div>

      {/* Structural Segmented Steps Pipeline */}
      <div className="grid grid-cols-5 gap-2 w-full">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isActive = i === currentIdx;
          const isCompleted = i < currentIdx;

          return (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isActive
                  ? "bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                  : isCompleted
                    ? "bg-indigo-500/40"
                    : "bg-white/[0.04]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
