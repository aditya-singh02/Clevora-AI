import { motion } from "framer-motion";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiCoinLine } from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function PricingCard({ plan, currency, onCTA }) {
  const { dark } = useTheme();
  const price = currency === "inr" ? plan.inr : plan.usd;
  const symbol = currency === "inr" ? "₹" : "$";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className={`relative h-full flex flex-col p-7 rounded-2xl border transition-all duration-300 ${
        plan.popular
          ? "border-indigo-500/40"
          : dark
            ? "bg-white/[0.02] border-white/[0.08]"
            : "bg-white border-slate-200 shadow-sm"
      }`}
      style={
        plan.popular
          ? {
              background:
                "linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
              backdropFilter: "blur(10px)",
            }
          : {}
      }
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
        >
          ⭐ Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3
          className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}
        >
          {plan.name}
        </h3>
        <p className="text-xs text-slate-500">{plan.desc}</p>
        <div className="mt-5">
          <span
            className={`text-5xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
          >
            {price === 0 ? "Free" : `${symbol}${price}`}
          </span>
          {price > 0 && (
            <span className="text-slate-500 text-sm ml-1">/pack</span>
          )}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <RiCoinLine size={12} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-semibold">
            {plan.credits} credits
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <div
            key={f}
            className="flex items-center gap-2.5 text-sm text-slate-400"
          >
            <BsCheckCircleFill
              size={12}
              className={plan.popular ? "text-indigo-400" : "text-slate-600"}
              style={{ flexShrink: 0 }}
            />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        onClick={onCTA}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          plan.popular
            ? "text-white"
            : dark
              ? "text-white bg-white/[0.07] border border-white/[0.1] hover:bg-white/[0.12]"
              : "text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200"
        }`}
        style={
          plan.popular
            ? {
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
              }
            : {}
        }
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}
