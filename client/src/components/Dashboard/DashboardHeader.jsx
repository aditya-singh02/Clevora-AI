import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { TbCoin, TbMicrophone2, TbSparkles, TbPlus } from "react-icons/tb";
import GlassCard from "../ui/GlassCard.jsx";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({ user }) {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const firstName = user?.name?.split(" ")[0] || "Explorer";
  const userCredits = user?.credits ?? 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06] relative">
      {/* LEFT SECTION: Greeting & Subtext */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          <TbSparkles className="animate-pulse" size={12} />
          <span>{getGreeting()} · Welcome to your dashboard</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-slate-300 font-medium">Welcome back, </span>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {firstName}
          </span>
          <span className="text-indigo-400">👋</span>
        </h1>

        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
          Your account is fully ready. Are you ready to practice and improve
          your skills with our AI interviews today?
        </p>
      </motion.div>

      {/* RIGHT SECTION: Wallet Dropdown & Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center flex-wrap gap-4 sm:justify-start md:justify-end flex-shrink-0 relative"
      >
        {/* ANCHOR CONTAINER */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <div onClick={() => setDropdownOpen(!dropdownOpen)}>
            <GlassCard
              hover={true}
              padding="p-2 px-4"
              rounded={
                dropdownOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"
              }
              //  native card structure
              className={`flex items-center gap-2.5 flex-shrink-0 cursor-pointer border select-none transition-all duration-150 ${
                dropdownOpen
                  ? "bg-[#090d1a] border-white/[0.08] border-b-transparent"
                  : "border-white/[0.03] hover:border-amber-500/30"
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)] flex-shrink-0">
                <TbCoin size={14} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-extrabold">
                  Credits
                </span>
                <span className="text-xs font-extrabold text-amber-400 mt-0.5 leading-none">
                  {userCredits} Available
                </span>
              </div>
            </GlassCard>
          </div>

          {/*  DROPDOWN PANEL */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1 }}
                transition={{ duration: 0.1 }}
                className="absolute left-0 right-0 mt-0 z-50 w-full"
              >
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/pricing");
                  }}
                  // 🚀 Changing background to absolute solid matching sync base `#090d1a`
                  className={`w-full text-left font-bold text-xs p-2.5 rounded-b-xl rounded-t-none border-x border-b flex items-center gap-2.5 transition-all ${
                    dark
                      ? "bg-[#090d1a] border-white/[0.08] text-slate-300 hover:bg-white/[0.04] hover:text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  style={{
                    boxShadow: dark
                      ? "0 10px 20px rgba(0,0,0,0.6)"
                      : "0 10px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 flex-shrink-0">
                    <TbPlus size={11} strokeWidth={3} />
                  </div>
                  <span className="truncate">Buy More Credits</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Call to Action Button */}
        <motion.button
          onClick={() => navigate("/interview-setup")}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="
            px-5 py-3 rounded-xl text-xs font-bold tracking-wider text-white uppercase relative overflow-hidden group
            bg-gradient-to-r from-indigo-500 to-purple-600
            shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_36px_rgba(139,92,246,0.5)] 
            transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0
          "
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />
          <TbMicrophone2 size={16} strokeWidth={2.5} />
          <span>Start Interview</span>
        </motion.button>
      </motion.div>
    </header>
  );
}
