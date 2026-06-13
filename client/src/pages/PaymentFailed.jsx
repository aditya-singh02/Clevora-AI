import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TbCircleX,
  TbAlertCircle,
  TbRefresh,
  TbHelpCircle,
} from "react-icons/tb";

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract safe dynamic states passed from routing layer
  const { plan, errorMsg, orderId } = location.state || {};

  // Safety Guard: Agar koi bina failure data ke direct hit kare URL, toh bypass to billing
  useEffect(() => {
    if (!location.state) {
      console.warn("⚠️ Direct failure route access denied. Redirecting.");
      navigate("/payment", { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-xs font-mono tracking-widest text-slate-500 uppercase">
        Evaluating terminal parameters...
      </div>
    );
  }

  return (
    <div className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden select-none font-sans">
      {/*  High-End Cybernetic Red/Amber Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[140px] bg-red-500/[0.06] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-amber-500/[0.03] pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10 text-center space-y-8">
        {/* Step 1: Animated Rejection Cross */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-red-400 p-2 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]"
          >
            <TbCircleX size={64} className="stroke-[1.5]" />
          </motion.div>
        </div>

        {/* Header Typography Block */}
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight uppercase"
          >
            Transaction Declined
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-slate-400 font-medium max-w-xs mx-auto leading-relaxed"
          >
            The gateway handshake could not be completed. Your bank ledger was
            not charged.
          </motion.p>
        </div>

        {/* Step 2: The Failure Details Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group hover:border-red-500/20 transition-all duration-500"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06] text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <TbAlertCircle size={14} className="text-red-400" /> System
            Rejection Log
          </div>

          <div className="pt-4 space-y-3.5 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Attempted Allocation</span>
              <span className="text-slate-200 font-bold">
                {plan?.name || "Premium Tokens"} Pack
              </span>
            </div>

            <div className="flex flex-col gap-1 pt-1.5">
              <span className="text-slate-500">Reason For Failure</span>
              <span className="text-red-400 bg-red-500/[0.03] border border-red-500/10 rounded-xl p-3 font-medium text-xs leading-relaxed">
                {errorMsg ||
                  "Transaction session was dropped or aborted by user interface trigger."}
              </span>
            </div>

            {orderId && (
              <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.04]">
                <span className="text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider">
                  Gateway Order ID
                </span>
                <span className="text-slate-400 font-mono text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md tracking-tight">
                  {orderId}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Safe Money Trust Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto leading-normal"
        >
          If money was deducted from your account during this session, it will
          be automatically reverted back by your bank within 2-3 working days.
        </motion.p>

        {/* Step 3: Navigation Recovery Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          <button
            onClick={() => navigate("/payment")}
            className="w-full h-11 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-white/5 transition-all active:scale-[0.98]"
          >
            <TbRefresh size={16} /> Retry Checkout
          </button>

          <button
            onClick={() => window.open("mailto:support@yourportal.com")}
            className="w-full h-11 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-[0.98]"
          >
            <TbHelpCircle size={16} /> Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}
