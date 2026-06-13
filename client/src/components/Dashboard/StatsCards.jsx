import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../ui/GlassCard.jsx";
import { useGetAllInterviews } from "../../hooks/useGetAllInterviews.js"; // 🚀 Hook Imported
import {
  TbCoin,
  TbMicrophone2,
  TbTrendingUp,
  TbAward,
  TbFlame,
  TbClock,
  TbArrowUpRight,
  TbArrowDownRight,
} from "react-icons/tb";

export default function StatsCards({ user }) {
  const { dark } = useTheme();

  // SINGLE LINE DATA FETCH FROM YOUR HOOK
  const { interviews, loading } = useGetAllInterviews();

  // Base Data Mapping
  const availableCredits = user?.credits ?? 0;
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(
    (i) => i.status === "Completed",
  );

  // Score Calculations
  const avgScore =
    totalInterviews > 0
      ? (
          interviews.reduce((acc, curr) => acc + (curr.finalScore ?? 0), 0) /
          totalInterviews
        ).toFixed(1)
      : "0";

  const bestScore =
    totalInterviews > 0
      ? Math.max(...interviews.map((i) => i.finalScore ?? 0))
      : 0;

  // Real-time Duration Calculation from DB timestamps
  const totalMinutes = interviews.reduce((total, session) => {
    if (
      session.status === "Completed" &&
      session.createdAt &&
      session.updatedAt
    ) {
      const startTime = new Date(session.createdAt);
      const endTime = new Date(session.updatedAt);
      const differenceInMs = endTime - startTime;
      const sessionMinutes = Math.max(
        1,
        Math.round(differenceInMs / (1000 * 60)),
      );
      return total + sessionMinutes;
    }
    return total;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeDisplay = `${hours}h ${mins}m`;

  // Career Track: Finding most practiced job profile
  const rolesList = interviews.map((i) => i.role).filter(Boolean);
  const favoriteRole =
    rolesList.length > 0
      ? rolesList.reduce(
          (acc, curr, _, arr) =>
            arr.filter((v) => v === curr).length >
            arr.filter((v) => v === acc).length
              ? curr
              : acc,
          rolesList[0],
        )
      : "No sessions yet";

  const metricsData = [
    {
      id: "credits_pool",
      label: "Available Balance",
      value: `${availableCredits} Credits`,
      subtext: "Ready for your next mock test",
      isPositive: true,
      icon: TbCoin,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "total_interviews",
      label: "Total Interviews",
      value: `${totalInterviews} Sessions`,
      subtext: `${completedInterviews.length} successfully finished`,
      isPositive: totalInterviews > 0,
      icon: TbMicrophone2,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "avg_score",
      label: "Average Score",
      value: `${avgScore}/10 Rating`,
      subtext: "Your overall performance level",
      isPositive: parseFloat(avgScore) >= 6,
      icon: TbTrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "best_score",
      label: "Highest Score",
      value: `${bestScore}/10 Best`,
      subtext: "Your personal record score",
      isPositive: bestScore > 0,
      icon: TbAward,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "primary_focus",
      label: "Primary Focus",
      value: favoriteRole,
      subtext:
        totalInterviews > 0
          ? "Your most practiced job profile"
          : "Start a session to track focus",
      isPositive: totalInterviews > 0,
      icon: TbFlame,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      id: "time_telemetry",
      label: "Total Time Spent",
      value: timeDisplay,
      subtext: "Actual real-time practice duration",
      isPositive: totalInterviews > 0,
      icon: TbClock,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 25 },
    },
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
        <div className="h-4 w-4 rounded-full border border-white/20 border-t-[#6C63FF] animate-spin" />
        Loading your stats...
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
    >
      {metricsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.id} variants={cardVariants}>
            <GlassCard
              hover={true}
              padding="p-5"
              rounded="rounded-2xl"
              className="relative overflow-hidden flex flex-col h-full min-w-0"
            >
              <div className="flex items-center justify-between gap-4 w-full">
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${stat.iconBg}`}
                >
                  <Icon size={16} className={stat.iconColor} />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <h3
                  className={`text-2xl font-black tracking-tight transition-colors ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {stat.value}
                </h3>
                <div className="flex items-center gap-2 pt-0.5 min-w-0">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-md flex-shrink-0 ${stat.isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/10"}`}
                  >
                    {stat.isPositive ? (
                      <TbArrowUpRight size={10} />
                    ) : (
                      <TbArrowDownRight size={10} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium truncate ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
