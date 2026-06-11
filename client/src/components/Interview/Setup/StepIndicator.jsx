// src/components/Interview/Setup/StepIndicator.jsx
import React from "react";
import { motion } from "framer-motion";
import { BsCheckLg } from "react-icons/bs";
import { useTheme } from "../../../context/ThemeContext";

const STEPS = [
  { num: 1, label: "Upload Resume" },
  { num: 2, label: "Review & Edit" },
  { num: 3, label: "Configure" },
];

// 🚀 FIXED: Ab hum conditions par rely nahi karenge, seedhe customStep index pass karenge
export default function StepIndicator({ activeStep = 1 }) {
  const { dark } = useTheme();

  return (
    <div className="flex items-center justify-center mb-10 select-none">
      {STEPS.map((s, i) => {
        const done = activeStep > s.num;
        const active = activeStep === s.num;

        return (
          <div key={s.num} className="flex items-center">
            {/* Circle UI Stack */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  active
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(99,102,241,0)",
                          "0 0 0 8px rgba(99,102,241,0.15)",
                          "0 0 0 0 rgba(99,102,241,0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-400 ${
                  done
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : active
                      ? "border-indigo-500 text-indigo-400"
                      : dark
                        ? "border-slate-700 text-slate-600"
                        : "border-slate-300 text-slate-400"
                }`}
                style={
                  active && !done ? { background: "rgba(99,102,241,0.1)" } : {}
                }
              >
                {done ? <BsCheckLg size={14} /> : s.num}
              </motion.div>

              <span
                className={`text-xs font-semibold whitespace-nowrap tracking-wide transition-colors ${
                  active
                    ? "text-indigo-400"
                    : done
                      ? "text-slate-400"
                      : dark
                        ? "text-slate-600"
                        : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connecting Connector Line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 sm:w-28 h-px mx-3 mb-5 transition-all duration-500 ${
                  activeStep > s.num
                    ? "bg-indigo-600"
                    : dark
                      ? "bg-slate-800"
                      : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
