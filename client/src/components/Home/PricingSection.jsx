import { useState } from "react";
import { motion } from "framer-motion";
import { BsShieldCheck } from "react-icons/bs";
import { SiRazorpay } from "react-icons/si";
import { useTheme } from "../../context/ThemeContext.jsx";
import { plans, paymentMethods } from "../../data/pricing.js";
import PricingCard from "../ui/PricingCard.jsx";
import FadeIn from "../ui/FadeIn.jsx";

export default function PricingSection({ onSignup }) {
  const { dark } = useTheme();
  const [currency, setCurrency] = useState("inr");

  return (
    <section id="pricing" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-5">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[2.5px]">
            Simple pricing
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-3 ${dark ? "text-white" : "text-slate-900"}`}
          >
            Start free. Scale as you grow.
          </h2>
          <p className="text-slate-500 text-sm">
            No hidden charges · Credits never expire · Cancel anytime
          </p>
        </FadeIn>

        {/* Currency toggle */}
        <FadeIn className="flex justify-center mb-14">
          <div
            className="flex p-1 gap-1 rounded-xl"
            style={{
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
              border: dark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {[
              { id: "inr", label: "🇮🇳 INR" },
              { id: "usd", label: "🇺🇸 USD" },
            ].map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setCurrency(c.id)}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-2.5 rounded-[9px] text-sm font-bold transition-all duration-200 ${
                  currency === c.id
                    ? "text-white"
                    : dark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-slate-500 hover:text-slate-700"
                }`}
                style={
                  currency === c.id
                    ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      }
                    : {}
                }
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {plans.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <PricingCard plan={p} currency={currency} onCTA={onSignup} />
            </FadeIn>
          ))}
        </div>

        {/* Payment trust section */}
        <FadeIn>
          <div
            className={`p-7 sm:p-10 rounded-2xl text-center border ${dark ? "border-white/[0.07]" : "border-slate-200 bg-white"}`}
            style={dark ? { background: "rgba(255,255,255,0.02)" } : {}}
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mb-7"
              style={{
                background: "rgba(82,143,240,0.1)",
                border: "1px solid rgba(82,143,240,0.22)",
              }}
            >
              <SiRazorpay size={20} className="text-blue-400" />
              <BsShieldCheck size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-blue-300">
                Secure payments powered by Razorpay
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold ${
                    dark
                      ? "bg-white/[0.04] border-white/[0.08] text-slate-400"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  {pm.label}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600">
              256-bit SSL encryption · PCI DSS compliant · Your payment data is
              never stored on our servers
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
