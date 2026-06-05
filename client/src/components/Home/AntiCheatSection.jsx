import { motion } from "framer-motion";
import { BsCheckCircleFill, BsShieldCheck } from "react-icons/bs";
import { useTheme } from "../../context/ThemeContext.jsx";
import FadeIn from "../ui/FadeIn.jsx";

const checks = [
  "Tab switch detection",
  "Copy & paste blocking",
  "Time-away monitoring",
  "Fullscreen exit tracking",
  "Integrity Score 0-100",
  "Low / Medium / High risk",
];

export default function AntiCheatSection() {
  const { dark } = useTheme();

  return (
    <section className="relative z-10 py-20 px-5 sm:px-8">
      <FadeIn>
        <div
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative p-8 sm:p-14"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.07), rgba(234,88,12,0.04))",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
            style={{ background: "rgba(245,158,11,0.08)" }}
          />

          <div className="relative grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                <BsShieldCheck className="text-amber-400" size={13} />
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wide">
                  Anti-Cheat System
                </span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-5 ${dark ? "text-white" : "text-slate-900"}`}
              >
                Practice honestly.
                <br />
                <span className="text-amber-400">Perform confidently.</span>
              </h2>

              <p
                className={`leading-relaxed mb-7 ${dark ? "text-slate-400" : "text-slate-600"}`}
              >
                Built-in proctoring tracks your behaviour — tab switches, window
                focus, copy attempts, time away. You get an Integrity Score from
                0-100 so you know exactly how you'd perform under real
                conditions. The system never accuses — it only observes and
                reports.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {checks.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <BsCheckCircleFill
                      size={12}
                      className="text-amber-400 flex-shrink-0"
                    />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Integrity score display */}
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(245,158,11,0)",
                    "0 0 0 24px rgba(245,158,11,0.05)",
                    "0 0 0 0 rgba(245,158,11,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center"
                style={{
                  borderColor: "rgba(245,158,11,0.2)",
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.05))",
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl font-extrabold text-amber-400"
                >
                  94
                </motion.span>
                <span className="text-xs text-amber-400/70 font-semibold mt-1">
                  Integrity Score
                </span>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  {
                    l: "Low Risk",
                    c: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                  },
                  {
                    l: "Tabs: 0",
                    c: dark
                      ? "bg-white/[0.05] text-slate-400 border-white/[0.1]"
                      : "bg-slate-100 text-slate-500 border-slate-200",
                  },
                  {
                    l: "Copy: 0",
                    c: dark
                      ? "bg-white/[0.05] text-slate-400 border-white/[0.1]"
                      : "bg-slate-100 text-slate-500 border-slate-200",
                  },
                ].map((b) => (
                  <span
                    key={b.l}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${b.c}`}
                  >
                    {b.l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
