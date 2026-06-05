import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext.jsx";
import { faqs } from "../../data/faq.js";
import FadeIn from "../ui/FadeIn.jsx";
import GlassCard from "../ui/GlassCard.jsx";

export default function FAQSection() {
  const { dark } = useTheme();
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="relative z-10 py-20 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[2.5px]">
            Got questions?
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 ${dark ? "text-white" : "text-slate-900"}`}
          >
            Frequently asked
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
                  dark
                    ? "border-white/[0.07] hover:border-white/[0.13]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 ${
                    dark
                      ? "bg-white/[0.025] hover:bg-white/[0.04]"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold pr-4 ${dark ? "text-white" : "text-slate-900"}`}
                  >
                    {f.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 text-slate-500"
                  >
                    <HiOutlineChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`px-6 py-5 border-t ${
                          dark
                            ? "bg-white/[0.015] border-white/[0.06]"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <p
                          className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {f.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Still have questions */}
        <FadeIn delay={0.3} className="mt-10">
          <GlassCard className="text-center" padding="p-8">
            <p
              className={`text-base font-semibold mb-2 ${dark ? "text-white" : "text-slate-900"}`}
            >
              Still have questions?
            </p>
            <p
              className={`text-sm mb-5 ${dark ? "text-slate-400" : "text-slate-600"}`}
            >
              We're happy to help. Drop us a message anytime.
            </p>
            <a
              href="mailto:support@clevora.ai"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              }}
            >
              Contact Support →
            </a>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
