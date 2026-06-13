// src/components/Interview/Report/ScoreHero.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

// Animated circular score ring
function ScoreRing({ score = 0, size = 160, stroke = 10 }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(score / 10, 1);
  const offset = circ * (1 - pct);

  const color =
    score >= 8
      ? ["#10b981", "#34d399"]
      : score >= 6
        ? ["#6366f1", "#8b5cf6"]
        : ["#f59e0b", "#fbbf24"];

  // Animate number from 0 → score
  useEffect(() => {
    let frame = 0;
    const total = 60;
    const t = setInterval(() => {
      frame++;
      setDisplayed(+(score * (frame / total)).toFixed(1));
      if (frame >= total) clearInterval(t);
    }, 1200 / total);
    return () => clearInterval(t);
  }, [score]);

  const id = "scoreGrad";

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color[0]} />
            <stop offset="100%" stopColor={color[1]} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white leading-none">
          {displayed}
        </span>
        <span className="text-xs text-slate-500 mt-1">out of 10</span>
      </div>
    </div>
  );
}

// Single metric card
function MetricCard({ label, value, color, bg, border, delay }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 50;
    const t = setInterval(() => {
      frame++;
      setV(+(value * (frame / total)).toFixed(1));
      if (frame >= total) clearInterval(t);
    }, 1000 / total);
    return () => clearInterval(t);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`flex-1 p-4 rounded-2xl border text-center ${bg} ${border}`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className={`text-2xl font-extrabold ${color} mb-1`}>{v}</div>
      <div className="text-xs text-slate-500 font-semibold">{label}</div>
    </motion.div>
  );
}

export default function ScoreHero({ overallScores = {} }) {
  const { dark } = useTheme();
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
  } = overallScores;

  const metrics = [
    {
      label: "Confidence",
      value: confidence,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border border-indigo-500/20",
    },
    {
      label: "Communication",
      value: communication,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border border-violet-500/20",
    },
    {
      label: "Correctness",
      value: correctness,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border border-cyan-500/20",
    },
  ];

  const grade =
    finalScore >= 9
      ? { label: "Excellent 🏆", color: "text-emerald-400" }
      : finalScore >= 7
        ? { label: "Good 👍", color: "text-indigo-400" }
        : finalScore >= 5
          ? { label: "Fair 📈", color: "text-amber-400" }
          : { label: "Needs Work 💪", color: "text-red-400" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-2xl border relative overflow-hidden ${
        dark ? "border-white/[0.07]" : "border-slate-200 bg-white"
      }`}
      style={
        dark
          ? {
              background:
                "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))",
              backdropFilter: "blur(12px)",
            }
          : {}
      }
    >
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(99,102,241,0.07)" }}
      />

      <div className="relative flex flex-col sm:flex-row items-center gap-8">
        {/* Score ring */}
        <ScoreRing score={Number(finalScore)} />

        {/* Right side */}
        <div className="flex-1 w-full">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">
            Overall Performance
          </p>
          <h2 className={`text-2xl font-extrabold mb-1 ${grade.color}`}>
            {grade.label}
          </h2>
          <p
            className={`text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-600"}`}
          >
            Here's how you performed across all interview dimensions.
          </p>

          {/* Metric cards */}
          <div className="flex gap-3">
            {metrics.map((m, i) => (
              <MetricCard key={m.label} {...m} delay={0.2 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
