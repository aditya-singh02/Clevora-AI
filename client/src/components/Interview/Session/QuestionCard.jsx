// src/components/Interview/Setup/QuestionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TbBookmark } from 'react-icons/tb';

export default function QuestionCard({ question, currentIdx, totalQuestions }) {
  if (!question) return null;

  // Clear plain mapping for badges
  const difficultyColors = {
    easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    hard: "text-rose-400 bg-rose-500/10 border-rose-500/20"
  };

  return (
    <motion.div 
      key={currentIdx}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="w-full rounded-2xl bg-slate-900/40 border border-white/[0.06] p-7 backdrop-blur-2xl shadow-xl space-y-4 relative overflow-hidden"
    >
      {/* Metrics Category Top Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black font-mono text-indigo-400 uppercase tracking-widest">
          Question {currentIdx + 1} of {totalQuestions}
        </span>
        
        {/* Simple Difficulty Tag */}
        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border tracking-wider ${
          difficultyColors[question.difficulty] || "text-slate-400 border-white/[0.05]"
        }`}>
          {question.difficulty} level
        </span>
      </div>

      {/* Main Explicit Question Text Area */}
      <div className="flex gap-3 items-start pt-1">
        <div className="mt-1 text-slate-500 flex-shrink-0">
          <TbBookmark size={18} />
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed font-sans">
          {question.question}
        </p>
      </div>
      </motion.div>
    // </div>
  );
}