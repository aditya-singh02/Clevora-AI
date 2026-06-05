import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";
import FadeIn from "../ui/FadeIn.jsx";

const steps = [
  {
    num: "01",
    icon: "📄",
    title: "Upload Resume",
    desc: "AI extracts your skills, projects and experience level in seconds. No manual input.",
  },
  {
    num: "02",
    icon: "🚀",
    title: "Start Interview",
    desc: "Choose Technical or HR mode. Get 5 difficulty-graded questions tailored to YOUR profile.",
  },
  {
    num: "03",
    icon: "🎙️",
    title: "Answer with Voice",
    desc: "Speak naturally. AI listens and transcribes. Get real-time evaluation after each answer.",
  },
  {
    num: "04",
    icon: "📊",
    title: "Get Full Report",
    desc: "Scores, strengths, weaknesses, integrity rating and a clear roadmap to improve.",
  },
];

export default function HowItWorks() {
  const { dark } = useTheme();

  return (
    <section id="how-it-works" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[2.5px]">
            Simple process
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 ${dark ? "text-white" : "text-slate-900"}`}
          >
            Resume to offer letter{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in 4 steps
            </span>
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div
            className="absolute top-12 left-[12.5%] right-[12.5%] h-px hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent)",
            }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center relative">
                  {/* Icon box */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -4 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-5 relative z-10"
                    style={{
                      background: dark
                        ? "rgba(99,102,241,0.1)"
                        : "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.22)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
                    }}
                  >
                    {s.icon}
                    {/* Step number badge */}
                    <div
                      className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      }}
                    >
                      {s.num}
                    </div>
                  </motion.div>

                  <h3
                    className={`text-base font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${dark ? "text-slate-500" : "text-slate-600"}`}
                  >
                    {s.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
