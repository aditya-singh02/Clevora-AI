import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const QUESTION =
  "Tell me about a challenging project from your resume and how you solved it.";

const METRICS = [
  {
    label: "Confidence",
    key: "confidence",
    color: "from-indigo-500 to-blue-500",
    base: 78,
  },
  {
    label: "Communication",
    key: "communication",
    color: "from-violet-500 to-purple-500",
    base: 82,
  },
  {
    label: "Technical",
    key: "technical",
    color: "from-cyan-500 to-teal-500",
    base: 71,
  },
  {
    label: "Integrity",
    key: "integrity",
    color: "from-emerald-500 to-green-500",
    base: 96,
  },
];

export default function InterviewDemo() {
  const [wave, setWave] = useState(
    Array(18)
      .fill(0)
      .map(() => Math.random() * 32 + 4),
  );
  const [scores, setScores] = useState({
    confidence: 78,
    communication: 82,
    technical: 71,
    integrity: 96,
  });
  const [typed, setTyped] = useState(0);

  // Animate waveform + scores
  useEffect(() => {
    const wt = setInterval(() => {
      setWave(
        Array(18)
          .fill(0)
          .map(() => Math.random() * 36 + 4),
      );
      setScores((prev) => ({
        confidence: Math.min(
          100,
          Math.max(65, Math.round(prev.confidence + (Math.random() * 6 - 3))),
        ),
        communication: Math.min(
          100,
          Math.max(
            70,
            Math.round(prev.communication + (Math.random() * 4 - 2)),
          ),
        ),
        technical: Math.min(
          100,
          Math.max(60, Math.round(prev.technical + (Math.random() * 8 - 4))),
        ),
        integrity: Math.min(
          100,
          Math.max(88, Math.round(prev.integrity + (Math.random() * 2 - 1))),
        ),
      }));
    }, 450);
    return () => clearInterval(wt);
  }, []);

  // Typing animation — loops
  useEffect(() => {
    const tt = setInterval(() => {
      setTyped((p) => (p < QUESTION.length ? p + 1 : 0));
    }, 55);
    return () => clearInterval(tt);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8,12,24,0.9)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.07]"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex gap-1.5">
          {["bg-red-500", "bg-amber-500", "bg-emerald-500"].map((c) => (
            <div
              key={c}
              className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`}
            />
          ))}
        </div>
        <div className="flex-1 text-center">
          <span className="text-[11px] text-slate-500 font-medium tracking-wide">
            Clevora AI Interview — Live Session
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-red-500"
          />
          <span className="text-[10px] text-red-400 font-semibold tracking-wide">
            REC
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* AI message */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              AI
            </motion.div>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-xl border border-indigo-500/30"
                animate={{ scale: [1, 1.5 + i * 0.15], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-400">
                Clevora AI
              </span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-indigo-400"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                Interviewer
              </span>
            </div>
            <div
              className="p-3 rounded-xl text-sm text-slate-200 leading-relaxed"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {QUESTION.slice(0, typed)}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle"
              />
            </div>
          </div>
        </div>

        {/* User response with waveform */}
        <div className="flex items-start gap-3 flex-row-reverse">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            You
          </div>
          <div className="flex-1">
            <div
              className="p-3.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="text-[11px] text-slate-500 font-medium">
                  Listening...
                </span>
                <span className="ml-auto text-[10px] text-slate-600">0:23</span>
              </div>
              {/* Waveform */}
              <div className="flex items-center gap-0.5 h-9">
                {wave.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${h}px` }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-1 rounded-full"
                    style={{
                      background: `linear-gradient(to top, rgba(99,102,241,0.9), rgba(139,92,246,0.4))`,
                      minHeight: "3px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live metrics */}
        <div
          className="p-4 rounded-xl space-y-2.5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Live AI Analysis
            </span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold">
                Processing
              </span>
            </motion.div>
          </div>
          {METRICS.map((m) => (
            <div key={m.key} className="flex items-center gap-2.5">
              <span className="text-[11px] text-slate-600 w-24 flex-shrink-0">
                {m.label}
              </span>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <motion.div
                  animate={{ width: `${scores[m.key]}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                />
              </div>
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[11px] font-bold text-white w-6 text-right"
              >
                {scores[m.key]}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
