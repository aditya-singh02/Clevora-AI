import React, { useState } from "react";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/Dashboard/DashboardHeader.jsx";
import GamificationSection from "../components/Dashboard/GamificationSection.jsx";
import PerformanceAnalytics from "../components/Dashboard/PerformanceAnalytics.jsx";
import QuickActions from "../components/Dashboard/QuickActions.jsx";
import RecentInterviews from "../components/Dashboard/RecentInterviews.jsx";
import Sidebar from "../components/Dashboard/Sidebar.jsx";
import StatsCards from "../components/Dashboard/StatsCards.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

import { AnimatePresence, motion } from "framer-motion";
import { HiMenuAlt3 } from "react-icons/hi";
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";

export default function Dashboard() {
  const userState = useSelector((state) => state.user);
  const userData = userState?.userData || userState?.user || userState;

  const { dark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pos = useCursorGlow();

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden relative font-sans ${dark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {dark && <NeuralBg />}

      {/* Hover Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 hidden lg:block"
        style={{
          zIndex: 1,
          background: dark
            ? `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.06), transparent 40%)`
            : `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.03), transparent 40%)`,
        }}
      />

      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:block h-full z-20 flex-shrink-0">
        <Sidebar user={userData} isMobile={false} />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 backdrop-blur-2xl border-r ${dark ? "bg-[#030712]/95 border-white/[0.07]" : "bg-white/95 border-slate-200"}`}
            >
              <Sidebar
                user={userData}
                isMobile={true}
                closeMobileMenu={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header
          className={`md:hidden flex items-center justify-between px-6 h-16 border-b backdrop-blur-xl flex-shrink-0 transition-colors duration-300 ${dark ? "border-white/[0.06] bg-[#030712]/60" : "border-slate-200 bg-white/60"}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm bg-gradient-to-br from-indigo-500 to-purple-600">
              C
            </div>
            <span
              className={`font-extrabold text-base tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
            >
              Clevora
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dark ? "bg-white/[0.03] border-white/[0.08] text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}
          >
            <HiMenuAlt3 size={20} />
          </button>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar relative z-20">
          <div className="space-y-8 max-w-6xl w-full mx-auto">
            {/* Pure Synchronized Render Nodes */}
            <DashboardHeader user={userData} />

            <StatsCards user={userData} />

            <QuickActions />

            <div className="grid grid-cols-1 gap-6 items-start w-full min-w-0">
              <RecentInterviews user={userData} />
              <PerformanceAnalytics user={userData} />
            </div>

            <GamificationSection user={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}
