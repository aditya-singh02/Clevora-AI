// src/components/Interview/Report/QuestionBreakdown.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BsCheckCircleFill } from "react-icons/bs";

function scoreColor(s) {
  if (s >= 8) return "text-emerald-400";
  if (s >= 5) return "text-amber-400";
  return "text-red-400";
}
function scoreBg(s) {
  if (s >= 8) return "bg-emerald-500/10 border-emerald-500/25";
  if (s >= 5) return "bg-amber-500/10 border-amber-500/25";
  return "bg-red-500/10 border-red-500/25";
}
function diffBg(d) {
  if (d === "hard") return "bg-red-500/10 border-red-500/20 text-red-400";
  if (d === "medium")
    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
}

export default function QuestionBreakdown({ questions = [] }) {
  const { dark } = useTheme();
  const [open, setOpen] = useState(0);

  return (
    <div>
      <h3
        className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}
      >
        Question-wise Breakdown
      </h3>
      <div className="space-y-3">
        {questions.map((q, i) => {
          const score = q.scores?.score ?? q.score ?? 0;
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                dark
                  ? "border-white/[0.07] hover:border-white/[0.13]"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                  dark
                    ? "bg-white/[0.025] hover:bg-white/[0.04]"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {/* Q number */}
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  }}
                >
                  {i + 1}
                </span>
                {/* Question text */}
                <span
                  className={`flex-1 text-sm font-semibold text-left line-clamp-1 ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {q.question}
                </span>
                {/* Difficulty */}
                <span
                  className={`hidden sm:block px-2 py-0.5 rounded-lg text-xs font-bold border flex-shrink-0 ${diffBg(q.difficulty)}`}
                >
                  {q.difficulty || "easy"}
                </span>
                {/* Score */}
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border flex-shrink-0 ${scoreBg(score)} ${scoreColor(score)}`}
                >
                  {score}/10
                </span>
                {/* Arrow */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0 text-slate-500"
                >
                  <HiOutlineChevronDown size={16} />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-5 py-5 space-y-4 border-t ${
                        dark
                          ? "bg-white/[0.015] border-white/[0.06]"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Answer */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Your Answer
                        </p>
                        <p
                          className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {q.answer?.trim() || (
                            <span className="text-slate-600 italic">
                              No answer provided.
                            </span>
                          )}
                        </p>
                      </div>
                      {/* Feedback */}
                      <div
                        className={`px-4 py-3 rounded-xl border ${
                          dark
                            ? "bg-indigo-500/[0.07] border-indigo-500/20"
                            : "bg-indigo-50 border-indigo-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <BsCheckCircleFill
                            size={11}
                            className="text-indigo-400"
                          />
                          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                            AI Feedback
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {q.feedback || "No feedback available."}
                        </p>
                      </div>
                      {/* Score breakdown */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          {
                            label: "Score",
                            val: q.scores?.score ?? q.score ?? 0,
                          },
                          {
                            label: "Confidence",
                            val: q.scores?.confidence ?? q.confidence ?? 0,
                          },
                          {
                            label: "Communication",
                            val:
                              q.scores?.communication ?? q.communication ?? 0,
                          },
                          {
                            label: "Correctness",
                            val: q.scores?.correctness ?? q.correctness ?? 0,
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className={`text-center p-2.5 rounded-xl border ${scoreBg(s.val)}`}
                          >
                            <div
                              className={`text-base font-extrabold ${scoreColor(s.val)}`}
                            >
                              {s.val}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
