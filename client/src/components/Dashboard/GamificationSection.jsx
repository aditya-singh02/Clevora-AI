import React from "react";
import { motion } from "framer-motion";
import { useGetAllInterviews } from "../../hooks/useGetAllInterviews.js"; // 🚀 Hook Imported
import {
  TbTrophy,
  TbFlame,
  TbAward,
  TbCrown,
  TbChevronRight,
  TbCpu,
} from "react-icons/tb";
import GlassCard from "../ui/GlassCard.jsx";

export default function GamificationSection() {
  // Fetch data via custom hook
  const { interviews, loading } = useGetAllInterviews();

  // Count only finished interviews safely
  const interviewsCompleted = interviews.filter(
    (iv) => iv && iv.status?.toLowerCase() === "completed",
  ).length;

  // Simple Level calculation logic
  let calculatedLevel = 1;
  let currentLevelStart = 0;
  let nextLevelTarget = 3;

  if (interviewsCompleted >= 35) {
    calculatedLevel = 6;
    currentLevelStart = 35;
    nextLevelTarget = 999;
  } else if (interviewsCompleted >= 25) {
    calculatedLevel = 5;
    currentLevelStart = 25;
    nextLevelTarget = 35;
  } else if (interviewsCompleted >= 15) {
    calculatedLevel = 4;
    currentLevelStart = 15;
    nextLevelTarget = 25;
  } else if (interviewsCompleted >= 8) {
    calculatedLevel = 3;
    currentLevelStart = 8;
    nextLevelTarget = 15;
  } else if (interviewsCompleted >= 3) {
    calculatedLevel = 2;
    currentLevelStart = 3;
    nextLevelTarget = 8;
  } else {
    calculatedLevel = 1;
    currentLevelStart = 0;
    nextLevelTarget = 3;
  }

  // Calculate progress bar percentage
  const totalInterviewsInCurrentLevel = nextLevelTarget - currentLevelStart;
  const completedInCurrentLevel = interviewsCompleted - currentLevelStart;

  const xpPercentage =
    calculatedLevel === 6
      ? 100
      : (completedInCurrentLevel / totalInterviewsInCurrentLevel) * 100;

  // Level ranks setup
  const getRankConfig = (lvl) => {
    if (lvl === 1)
      return {
        name: "System Intern",
        color: "text-slate-400 border-slate-500/20 bg-slate-500/5",
        glow: "bg-slate-500/10",
      };
    if (lvl === 2)
      return {
        name: "Syntax Cadet",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        glow: "bg-emerald-500/10",
      };
    if (lvl === 3)
      return {
        name: "Logic Architect",
        color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
        glow: "bg-cyan-500/10",
      };
    if (lvl === 4)
      return {
        name: "Byte Master",
        color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
        glow: "bg-indigo-500/10",
      };
    if (lvl === 5)
      return {
        name: "Kernel Elite",
        color: "text-pink-400 border-pink-500/20 bg-pink-500/5",
        glow: "bg-pink-500/10",
      };
    return {
      name: "Quantum Overlord",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      glow: "bg-amber-500/10",
    };
  };

  const currentRank = getRankConfig(calculatedLevel);

  // User Badges setup
  const badges = [
    {
      id: 1,
      name: "First Shot",
      icon: TbAward,
      desc: "Reached Level 2",
      unlocked: calculatedLevel >= 2,
      color:
        calculatedLevel >= 2
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
          : "text-slate-600 bg-slate-900/40 border-slate-800",
    },
    {
      id: 2,
      name: "Matrix Breaker",
      icon: TbCrown,
      desc: "Reached Level 4",
      unlocked: calculatedLevel >= 4,
      color:
        calculatedLevel >= 4
          ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]"
          : "text-slate-600 bg-slate-900/40 border-slate-800",
    },
    {
      id: 3,
      name: "Quantum Aura",
      icon: TbCpu,
      desc: "Reached Max Level 6",
      unlocked: calculatedLevel >= 6,
      color:
        calculatedLevel >= 6
          ? "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
          : "text-slate-600 bg-slate-900/40 border-slate-800",
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-32 rounded-2xl animate-pulse bg-white/[0.01] border border-white/[0.04]" />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
      {/* 1. PROGRESS CARD */}
      <GlassCard
        hover={true}
        className="p-6 flex flex-col justify-between h-full relative overflow-hidden group lg:col-span-1 border border-white/[0.04]"
      >
        <div
          className={`absolute top-0 right-0 w-32 h-32 ${currentRank.glow} rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125`}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-colors duration-300 ${currentRank.color}`}
              >
                <TbFlame
                  size={18}
                  className={interviewsCompleted > 0 ? "animate-pulse" : ""}
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Your Rank
                </h3>
                <p className="text-lg font-black text-white mt-0.5 tracking-tight">
                  {currentRank.name}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg uppercase tracking-wider ${currentRank.color}`}
            >
              Level {calculatedLevel}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
              <span className="text-slate-500">Next Level Goal</span>
              <span className="text-indigo-400">
                {calculatedLevel === 6
                  ? "MAX LEVEL"
                  : `${interviewsCompleted} / ${nextLevelTarget} Interviews`}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/[0.03]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 🌟 Super Easy English Description */}
        <p className="text-slate-500 text-[11px] mt-4 leading-relaxed">
          {calculatedLevel === 6
            ? "Great job! You have reached the maximum rank. You are now a Quantum Overlord."
            : `You are currently at rank ${currentRank.name}. Complete ${nextLevelTarget - interviewsCompleted} more interviews to unlock Level ${calculatedLevel + 1}.`}
        </p>
      </GlassCard>

      {/* 2. BADGES CARD */}
      <GlassCard
        hover={true}
        className="p-6 lg:col-span-2 flex flex-col justify-between h-full relative overflow-hidden group border border-white/[0.04]"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TbTrophy size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Your Badges
                </h3>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  Unlocked Achievements
                </p>
              </div>
            </div>
            <button className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5 group/btn">
              <span>View All</span>
              <TbChevronRight
                size={14}
                className="group-hover/btn:translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {badges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                    badge.unlocked
                      ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                      : "bg-slate-950/20 border-slate-900 opacity-40"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all duration-500 ${badge.color}`}
                  >
                    <BadgeIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold truncate ${badge.unlocked ? "text-slate-200" : "text-slate-500"}`}
                    >
                      {badge.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
