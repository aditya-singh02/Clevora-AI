// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TbCircleCheck,
  TbReceipt,
  TbArrowRight,
  TbLayoutDashboard,
  TbLoaderQuarter,
} from "react-icons/tb";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🚀 LOCAL LOADER STATE: Jo pricing page ke jhanjhat ko khatam karegi
  const [isGenerating, setIsGenerating] = useState(true);

  const userState = useSelector((state) => state.user);
  const currentCredits = userState?.userData?.credits ?? 0;
  const { plan, newCredits, paymentId } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate("/payment", { replace: true });
      return;
    }

    // 🚀 1.2 second ka smooth transition fake timer taaki receipt generate hoti hui dikhe
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (!location.state) return null;

  // 🎫 1. HIGH-END NEURAL LOADER SCREEN (Pricing page ka patta saaf)
  if (isGenerating) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center space-y-4 font-sans select-none">
        <div className="relative flex items-center justify-center">
          <TbLoaderQuarter
            size={44}
            className="text-indigo-500 animate-spin stroke-[1.5]"
          />
          <div className="absolute w-12 h-12 rounded-full border border-indigo-500/20 animate-ping opacity-40" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-200 tracking-wide">
            Receipt Generating...
          </p>
          <p className="text-[11px] font-mono text-slate-500 tracking-tight uppercase">
            Securely syncing wallet tokens ledger
          </p>
        </div>
      </div>
    );
  }

  // 🎫 2. ORIGINAL SUCCESS RECEIPT SCREEN
  return (
    <div className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden select-none font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[140px] bg-emerald-500/[0.08] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-indigo-500/[0.04] pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10 text-center space-y-8">
        {/* Animated Checkmark */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-emerald-400 p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
          >
            <TbCircleCheck size={64} className="stroke-[1.5]" />
          </motion.div>
        </div>

        {/* Header Block */}
        <div className="space-y-2">
          <motion.h2 className="text-3xl font-black bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight uppercase">
            Secure Checkout Verified
          </motion.h2>
          <p className="text-xs text-slate-400 font-medium">
            Your transaction was authenticated successfully. Wallet ledger
            synced.
          </p>
        </div>

        {/* Dynamic Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] duration-500"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06] text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <TbReceipt size={14} className="text-emerald-400" /> Transaction
            Receipt
          </div>

          <div className="pt-4 space-y-3.5 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Allocation</span>
              <span className="text-slate-200 font-bold">
                {plan?.name} Pack
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credits Injected</span>
              <span className="text-indigo-400 font-mono font-bold">
                +{plan?.credits} Tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Investment</span>
              <span className="text-emerald-400 font-mono font-bold">
                ₹{plan?.inr}.00
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.04]">
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider">
                Gateway Payment ID
              </span>
              <span className="text-slate-400 font-mono text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md tracking-tight select-text">
                {paymentId}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Live Wallet Balance */}
        <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-3 inline-flex items-center gap-2 mx-auto text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Current Wallet Ledger Balance:{" "}
          <strong className="text-white font-bold">
            {newCredits || currentCredits} Credits
          </strong>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-11 bg-white text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-white/5"
          >
            <TbLayoutDashboard size={16} /> Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/interview-setup")}
            className="w-full h-11 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-indigo-500/20 shadow-xl shadow-indigo-600/10"
          >
            Start Interview <TbArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
