import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { TbCoin, TbMicrophone2, TbSparkles } from "react-icons/tb";
import GlassCard from "../ui/GlassCard.jsx"; 

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({user}) {
  const { dark } = useTheme();
  const navigate = useNavigate();
  // const { userData } = useSelector((s) => s.user);

  console.log("DashboardHeader render - userData:", user); // Debug log to trace userData flow
  // Safely extracting the first name with splitting logic
  const firstName = user?.name?.split(" ")[0] || "Explorer";
  const userCredits = user?.credits ?? 0;

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06] relative">
      {/* LEFT SECTION: Dynamic Greeting & Silver Headings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="space-y-1"
      >
        {/* Sparkle Tag Alert */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          <TbSparkles className="animate-pulse" size={12} />
          <span>{getGreeting()} · Workspace Operational</span>
        </div>

        {/* Pure silver-white linear gradient matching the landing page */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-slate-300 font-medium">Welcome back, </span>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {firstName}
          </span>
          <span className="text-indigo-400">👋</span>
        </h1>

        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
          Your system telemetry is fully synced. Ready to master your next
          conversational engineering simulation checkpoint?
        </p>
      </motion.div>

      {/* RIGHT SECTION: Reusable Tokens Wallet & Animated CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center flex-wrap gap-4 sm:justify-start md:justify-end flex-shrink-0"
      >
        {/* Wallet Matrix using your core Reusable GlassCard component */}
        <GlassCard
          hover={true}
          padding="p-2 px-4"
          rounded="rounded-xl"
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          {/* Amber Mini Glow Icon Block */}
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)] flex-shrink-0">
            <TbCoin size={14} />
          </div>
          <div className="flex flex-col">
            {/* FIXED: Text made ultra-sleek, micro-sized, and highly tracking-spaced */}
            <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-extrabold">
              Tokens
            </span>
            <span className="text-xs font-extrabold text-amber-400 mt-0.5 leading-none">
              {userCredits} Available
            </span>
          </div>
        </GlassCard>

        {/* Primary Action Call to Action Button */}
        <motion.button
          onClick={() => navigate("/interview/setup")}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="
            px-5 py-3 rounded-xl text-xs font-bold tracking-wider text-white uppercase relative overflow-hidden group
            bg-gradient-to-r from-indigo-500 to-purple-600
            shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_36px_rgba(139,92,246,0.5)] 
            transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0
          "
        >
          {/* Neon sliding gloss effect overlay */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />

          <TbMicrophone2 size={16} strokeWidth={2.5} />
          <span>Start Interview</span>
        </motion.button>
      </motion.div>
    </header>
  );
}
