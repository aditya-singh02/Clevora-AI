import React from "react";
import { motion } from "framer-motion";
import {
  TbAlertTriangle,
  TbCoin,
  TbPlayerPlay,
  TbLoaderQuarter,
} from "react-icons/tb";

export default function SetupSummary({
  config,
  selectedMode,
  isStarting,
  onStart,
}) {
  if (!config?.role) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.06] shadow-2xl relative overflow-hidden"
    >
      {/* Background Matrix Flare Grid */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl pointer-events-none" />

      {/* 1. Transactional Warning & Cost Matrix Badge */}
      <div className="p-3.5 rounded-xl bg-amber-500/[0.02] border border-amber-500/20 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-inner">
          <TbAlertTriangle size={16} />
        </div>
        <div className="space-y-1">
          <h5 className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            Token Verification Protocol Active
          </h5>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Starting this session will lock your active parameters and deduct
            exactly
            <span className="text-amber-400 font-bold px-1 inline-flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 rounded mx-1">
              <TbCoin size={11} className="animate-pulse" /> 20 Credits
            </span>
            from your ranking dashboard account logic.
          </p>
        </div>
      </div>

      {/* 2. Interactive Telemetry Meta Log */}
      <div className="grid grid-cols-3 gap-2 py-1.5 px-1 bg-black/20 rounded-xl border border-white/[0.03]">
        <div className="text-center space-y-0.5 border-r border-white/[0.05]">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            Simulation
          </span>
          <span className="text-[11px] font-black text-white truncate max-w-full block px-1">
            {selectedMode}
          </span>
        </div>
        <div className="text-center space-y-0.5 border-r border-white/[0.05]">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            Target Scope
          </span>
          <span className="text-[11px] font-black text-indigo-400 truncate max-w-full block px-1">
            {config.experience}
          </span>
        </div>
        <div className="text-center space-y-0.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            Questions Log
          </span>
          <span className="text-[11px] font-black text-emerald-400 block">
            5 Sessions
          </span>
        </div>
      </div>

      {/* 3. The Ultimate Hyper-Interactive Start Button */}
      <motion.button
        whileHover={
          !isStarting
            ? { scale: 1.015, boxShadow: "0 0 25px rgba(99,102,241,0.25)" }
            : {}
        }
        whileTap={!isStarting ? { scale: 0.985 } : {}}
        disabled={isStarting}
        onClick={onStart}
        className={`w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 border ${
          isStarting
            ? "bg-slate-900 border-white/[0.08] text-slate-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white border-indigo-400/30"
        }`}
      >
        {isStarting ? (
          <>
            <TbLoaderQuarter
              size={16}
              className="animate-spin text-indigo-400"
            />
            <span>Configuring Neural Pipeline...</span>
          </>
        ) : (
          <>
            <TbPlayerPlay size={14} className="text-white/90" />
            <span>Start Core Interview Simulation</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
