import { motion } from "framer-motion";
import { IoMdTrophy } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext.jsx";
import FadeIn from "../ui/FadeIn.jsx";

export default function CTASection({ onSignup }) {
  const { dark } = useTheme();

  return (
    <section className="relative z-10 py-24 px-5 sm:px-8">
      <FadeIn>
        <div
          className="max-w-4xl mx-auto text-center p-14 sm:p-20 rounded-3xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(99,102,241,0.12), transparent 70%)",
            }}
          />

          {/* Top glow line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(139,92,246,0.8), transparent)",
            }}
          />

          <div className="relative">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.28)",
              }}
            >
              <IoMdTrophy size={14} className="text-amber-400" />
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wide">
                Limited time — Free credits
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 ${dark ? "text-white" : "text-slate-900"}`}
            >
              Your dream job is
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                one interview away.
              </span>
            </h2>

            <p
              className={`text-lg mb-10 max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}
            >
              Join 12,000+ students using Clevora to crack placements at top
              companies. Start free — 100 credits, no card needed.
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={onSignup}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 text-lg font-extrabold text-white rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 16px 48px rgba(99,102,241,0.4)",
              }}
            >
              🎁 Claim Your 100 Free Credits
            </motion.button>

            <p className="text-xs text-slate-600 mt-5">
              Free forever · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
