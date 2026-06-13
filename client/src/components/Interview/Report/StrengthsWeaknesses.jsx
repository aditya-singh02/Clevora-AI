import React from "react";
import { TbCircleCheck, TbAlertTriangle } from "react-icons/tb";

export default function StrengthsWeaknesses({
  strengths = [],
  improvements = [],

}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Strengths Container Block */}
      <div className="bg-slate-900/40 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <TbCircleCheck size={18} />
          </div>
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            Key Strengths Validated
          </h4>
        </div>
        <ul className="space-y-2.5 pt-1">
          {strengths.map((str, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed"
            >
              <span className="text-emerald-500 mt-0.5">•</span> {str}
            </li>
          ))}
        </ul>
      </div>

      {/* Weakness/Improvements Container Block */}
      <div className="bg-slate-900/40 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
            <TbAlertTriangle size={18} />
          </div>
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            Areas Seeking Calibration
          </h4>
        </div>
        <ul className="space-y-2.5 pt-1">
          {improvements.map((imp, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed"
            >
              <span className="text-rose-500 mt-0.5">•</span> {imp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
