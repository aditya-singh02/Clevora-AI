import React from "react";
import { motion } from "framer-motion";
import { TbActivity, TbAlertTriangle, TbShieldLock } from "react-icons/tb";
import { useSelector } from "react-redux";
import PricingCard from "../components/Payment/PricingCard.jsx";
import { plans } from "../data/pricing.js";
import { usePayment } from "../hooks/usePayment.js";
import { useRazorpay } from "../hooks/useRazorpay.js";
import PaymentStatusBanner from "../components/Payment/PaymentStatusBanner.jsx";
import LoadingOverlay from "../components/Payment/LoadingOverlay.jsx";

export default function PaymentPage() {
  const { sdkReady, sdkError, sdkLoading, retry } = useRazorpay();
  const { handleBuy, isLoading, activePlan, status, clearStatus, overlayMsg } =
    usePayment();

  const userState = useSelector((state) => state.user);
  const credits = userState?.userData?.credits ?? 0;
  console.log("User state from Redux:", userState);
  console.log("User credits from Redux state:", credits);

  return (
    <div className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-16 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-start select-none font-sans">
      {/*  1. Non-blocking Global Alert Banner (Top of screen) */}

      <div className="w-full max-w-md mx-auto mb-4">
        <PaymentStatusBanner status={status} onClose={clearStatus} />
      </div>

      {/*  2. Full Screen Safety Blocker */}
      <LoadingOverlay isOpen={isLoading} message={overlayMsg} />

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-indigo-500/[0.08] pointer-events-none" />

      {/*  High-End Neural Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-indigo-500/[0.08] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] bg-purple-500/[0.06] pointer-events-none" />

      {/* Global layout container */}
      <div className="w-full max-w-5xl mx-auto relative z-10 space-y-8 mt-4 mb-12">
        {/* Header Announcement Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono tracking-wider font-bold uppercase mx-auto"
          >
            <TbActivity size={12} className="animate-pulse" /> Placement Pass
            Engine Active
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent tracking-tight leading-none"
          >
            Practice Smarter.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Get Hired Faster.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto font-medium"
          >
            Take AI-powered mock interviews, receive detailed feedback, and
            improve your performance before real placements and job interviews.
          </motion.p>
        </div>

        {/*  Razorpay Connection/Ad-Blocker Error Handling */}
        {sdkError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <span>{sdkError}</span>
            <button
              onClick={retry}
              disabled={sdkLoading}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-xl uppercase font-mono font-black tracking-tight transition-all text-[10px]"
            >
              {sdkLoading ? "Loading..." : "Retry"}
            </button>
          </motion.div>
        )}

        {/*  Wallet Badge Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="max-w-md mx-auto pt-2"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl px-5 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">
                Account Balance
              </span>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                1 AI Interview ={" "}
                <span className="text-indigo-400 font-mono font-bold">
                  20 Credits
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-xl">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {credits}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-mono font-black">
                Credits
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid Layout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch"
        >
          {plans
            .filter((plan) => plan.id !== "starter")
            .map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currency="inr"
                isGlobalLoading={isLoading && activePlan?.id === plan.id}
                disabled={
                  !sdkReady ||
                  sdkLoading ||
                  (isLoading && activePlan?.id !== plan.id)
                }
                onCTA={() => handleBuy(plan, sdkReady)}
              />
            ))}
        </motion.div>

        {/*  High Trust Grid Badges Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto pt-8"
        >
          <div className="text-center mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-500">
              Platform Transaction Standards
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Instant Credits Sync",
                desc: "Credits are injected immediately into your database ledger profile post-handshake.",
              },
              {
                title: "Secure Payments",
                desc: "100% encryption protocols powered seamlessly via Razorpay systems.",
              },
              {
                title: "No Hidden Subscriptions",
                desc: "Pure one-time tokens purchase module. Zero automatic recurring bills.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-xl p-5 text-center hover:bg-white/[0.02] transition-colors duration-300"
              >
                <h4 className="font-bold text-slate-200 text-sm mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium leading-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/*  Footer Security Trust Anchor */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium pt-4 border-t border-white/[0.04] max-w-xs mx-auto">
          <TbShieldLock size={20} className="text-indigo-400" />
          <span className="font-mono text-[11px] tracking-tight font-semibold">
            Secure checkout powered by Razorpay
          </span>
        </div>
      </div>
    </div>
  );
}
