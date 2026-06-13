import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  TbCoins,
  TbPlayerPlay,
  TbLoaderQuarter,
  TbShieldCheck,
} from "react-icons/tb";

export default function ConfirmStart({ selectedMode, isStarting, onStart }) {
  const { dark } = useTheme();

  return (
    <div
      className={`w-full rounded-2xl p-6 border shadow-xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 ${
        dark
          ? "bg-slate-900/30 border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          : "bg-white border-slate-200 shadow-[0_20px_40px_rgba(15,23,42,0.05)]"
      }`}
    >
      {/* Top Border Accent Layer */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* LEFT SIDE: CREDITS CHECK & METRICS */}
        <div className="flex items-start gap-4 max-w-md">
          <div
            className={`p-3 rounded-xl border flex-shrink-0 mt-0.5 transition-colors ${
              dark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                : "bg-amber-50/50 border-amber-200 text-amber-600"
            }`}
          >
            <TbCoins
              size={22}
              className="animate-pulse"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4
                className={`text-xs font-black uppercase tracking-wider ${dark ? "text-amber-400" : "text-amber-700"}`}
              >
                Credit Verification
              </h4>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  dark
                    ? "bg-slate-950 text-slate-400 border border-white/5"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Auto-Audited
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Starting this session will deduct exactly{" "}
              <span
                className={`font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
              >
                20 Credits
              </span>{" "}
              from your dashboard balance to initialize 5 personalized interview
              tracks.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: ACTION LAUNCHER BUTTON */}
        <div className="flex-shrink-0 sm:min-w-[240px] flex flex-col gap-2 justify-center">
          <button
            type="button"
            disabled={isStarting}
            onClick={onStart}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 border border-indigo-400/20 shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {isStarting ? (
              <>
                <TbLoaderQuarter
                  size={16}
                  className="animate-spin text-white"
                />
                Launching Engine...
              </>
            ) : (
              <>
                <TbPlayerPlay
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
                Start Interview
              </>
            )}
          </button>

          {/* Subtle Environment Subtext */}
          <div className="flex items-center justify-center gap-1 opacity-40 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
            <TbShieldCheck size={11} className="text-emerald-500" /> Track:{" "}
            {selectedMode || "Technical"}
          </div>
        </div>
      </div>
    </div>
  );
}
