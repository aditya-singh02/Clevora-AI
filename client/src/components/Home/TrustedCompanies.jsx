import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";
import { companies } from "../../data/companies.js";
import FadeIn from "../ui/FadeIn.jsx";

// Duplicate for seamless loop
const doubled = [...companies, ...companies];

export default function TrustedCompanies() {
  const { dark } = useTheme();

  return (
    <section
      className={`relative z-10 py-14 border-y ${dark ? "border-white/[0.05]" : "border-slate-200"}`}
    >
      <FadeIn className="mb-8 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-[3px] font-semibold">
          Trusted by students cracking placements at
        </p>
      </FadeIn>

      {/* Marquee wrapper */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{
            background: dark
              ? "linear-gradient(to right, #030712, transparent)"
              : "linear-gradient(to right, #f8fafc, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{
            background: dark
              ? "linear-gradient(to left, #030712, transparent)"
              : "linear-gradient(to left, #f8fafc, transparent)",
          }}
        />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 items-center"
          style={{ width: "max-content" }}
        >
          {doubled.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2.5 cursor-default select-none flex-shrink-0 group"
            >
              {c.Icon && (
                <c.Icon
                  size={20}
                  className="opacity-40 group-hover:opacity-100 transition-all duration-300"
                  style={{ color: c.color }}
                />
              )}
              <span
                className="text-sm font-bold transition-all duration-300 text-slate-600 group-hover:text-slate-300"
                style={{ letterSpacing: "-0.3px" }}
              >
                {c.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
