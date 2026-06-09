import React from "react";
import { TbLoaderQuarter } from "react-icons/tb";

export default function LoadingOverlay({ isOpen, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030712]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
      <TbLoaderQuarter size={36} className="text-indigo-500 animate-spin" />
      <p className="text-xs font-mono uppercase tracking-widest text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
        {message || "Processing..."}
      </p>
    </div>
  );
}
