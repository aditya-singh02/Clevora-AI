import React from "react";
import { motion } from "framer-motion";
import { TbMessageCode, TbArrowNarrowRight } from "react-icons/tb";

export default function FeedbackCard({ feedback, onNext }) {
  if (!feedback) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-950/60 border border-indigo-500/20 p-6 backdrop-blur-3xl shadow-2xl space-y-4 relative overflow-hidden mt-4"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
          <TbMessageCode size={20} />
        </div>

        <div className="space-y-1.5 flex-1">
          <h4 className="text-sm font-black uppercase text-slate-200 tracking-wider">
            Instant AI Response Review
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {feedback}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-white/[0.04]">
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          Proceed to Next Question
          <TbArrowNarrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
