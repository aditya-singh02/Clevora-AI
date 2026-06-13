import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import InterviewDemo from "./InterviewDemo.jsx";

const PHRASES = [
  "Upload your resume",
  "AI interviews you",
  "Get instant feedback",
  "Land your dream job",
];

export default function HeroSection({ onLogin, onSignup }) {
  const { dark } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const [phraseIdx, setPhraseIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setPhraseIdx((p) => (p + 1) % PHRASES.length),
      2500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 pt-28 pb-20 px-5 sm:px-8 overflow-hidden"
    >
      <motion.div style={{ y }} className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* ── LEFT: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              />
              <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">
                India's #1 AI Interview Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className={`text-5xl sm:text-6xl lg:text-[66px] font-extrabold leading-[1.04] tracking-[-2.5px] mb-7 ${dark ? "text-white" : "text-slate-900"}`}
            >
              Stop practising wrong.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start acing interviews.
              </span>
            </motion.h1>

            {/* Animated cycling phrases */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-7"
            >
              {PHRASES.map((p, i) => (
                <motion.span
                  key={p}
                  animate={{
                    opacity: i === phraseIdx ? 1 : 0.25,
                    scale: i === phraseIdx ? 1 : 0.96,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                    i === phraseIdx
                      ? "text-indigo-300 bg-indigo-500/15 border-indigo-500/35"
                      : dark
                        ? "text-slate-600 bg-white/[0.03] border-white/[0.05]"
                        : "text-slate-400 bg-slate-100 border-slate-200"
                  }`}
                >
                  {p}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`text-lg leading-relaxed max-w-lg mb-10 font-light ${dark ? "text-slate-400" : "text-slate-600"}`}
            >
              Upload your resume, let AI conduct a personalised voice interview,
              get instant feedback on every answer, and walk into real
              interviews with full confidence.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <motion.button
                onClick={onSignup}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 font-extrabold text-white rounded-xl text-base"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
                }}
              >
                🎁 Claim 100 Free Credits
              </motion.button>
              <motion.button
                onClick={onLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`px-8 py-4 font-semibold rounded-xl text-base border transition-all duration-200 ${
                  dark
                    ? "text-slate-300 border-white/[0.1] hover:border-white/[0.22] hover:text-white hover:bg-white/[0.04]"
                    : "text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                Sign In →
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-slate-600"
            >
              No credit card required · Free forever plan · 100 credits on
              signup
            </motion.p>
          </div>

          {/* ── RIGHT: Live Demo ────────────────────────────── */}
          <InterviewDemo />
        </div>
      </motion.div>
    </section>
  );
}
