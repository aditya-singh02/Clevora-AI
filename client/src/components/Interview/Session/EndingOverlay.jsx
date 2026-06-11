// src/components/Interview/Session/EndingOverlay.jsx
import React from "react";
import { motion } from "framer-motion";
import { TbLoaderQuarter, TbShieldCheck } from "react-icons/tb";

export default function EndingOverlay({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      <div className="max-w-sm text-center space-y-6">
        {/* Animated Spin Status Icon Rings */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 text-indigo-500 animate-spin">
            <TbLoaderQuarter size={64} style={{ animationDuration: "2s" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <TbShieldCheck size={24} />
          </div>
        </div>

        {/* Informative Plain Logs */}
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Compiling Session Matrix
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please hold tightly on this screen. Our systems are saving your
            voice metrics and compiling your final score overview reports
            directly...
          </p>
        </div>

        {/* Micro Loader Bar */}
        <div className="w-48 h-1 bg-white/[0.04] rounded-full mx-auto overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
