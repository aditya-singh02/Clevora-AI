import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../ui/GlassCard.jsx";
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

  // Data mapping from your schema models
  const availableCredits = user?.credits ?? 100;
  const rawInterviews = user?.interviews || []; // assuming interviews is an array of interview session objects with properties like finalScore and status
  const totalInterviews = rawInterviews.length; // length of the interviews array gives us the total number of interview sessions run by the user
  const completedInterviews = rawInterviews.filter(
    (i) => i.status === "Completed",
  );

  const avgScore =
    totalInterviews > 0
      ? Math.round(
          rawInterviews.reduce((acc, curr) => acc + (curr.finalScore ?? 0), 0) /
            totalInterviews,
        )
      : 0;

  const bestScore =
    totalInterviews > 0
      ? Math.max(...rawInterviews.map((i) => i.finalScore ?? 0))
      : 0;

  const currentStreak =
    user?.analytics?.streakDays || user?.analytics?.currentStreak || 0;
  const calculatedHours =
    totalInterviews > 0 ? (totalInterviews * 0.25).toFixed(1) : "0";

  const metricsData = [
    {
      id: "credits_pool",
      label: "Engine Fuel",
      value: `${availableCredits} Tokens`,
      subtext: "Ready for instant simulation",
      isPositive: true,
      icon: TbCoin,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "total_interviews",
      label: "Total Run",
      value: `${totalInterviews} Sessions`,
      subtext: `${completedInterviews.length} status completed`,
      isPositive: totalInterviews > 0,
      icon: TbMicrophone2,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "avg_score",
      label: "Avg Accuracy",
      value: `${avgScore}% Matrix`,
      subtext: "Live evaluation checkpoint",
      isPositive: avgScore > 60,
      icon: TbTrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "best_score",
      label: "Best Checkpoint",
      value: `${bestScore}% Score`,
      subtext: "Peak final report target",
      isPositive: bestScore > 0,
      icon: TbAward,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "streak_engine",
      label: "Consistency Engine",
      value: `${currentStreak} Days`,
      subtext:
        currentStreak > 0
          ? "Active multiplier pacing"
          : "Requires session start",
      isPositive: currentStreak > 0,
      icon: TbFlame,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      id: "time_telemetry",
      label: "Telemetry Duration",
      value: `${calculatedHours}h Run`,
      subtext: "Estimated session airtime",
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

  return (
    // FIXED: Changed layout grid to force a spacious 3-column split on large screens, automatically pushing the other 3 cards to a new line row!
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
            {/* Padding restored to p-5 to make cards comfortably large */}
            <GlassCard
              hover={true}
              padding="p-5"
              rounded="rounded-2xl"
              className="relative overflow-hidden flex flex-col h-full min-w-0"
            >
              {/* Card Meta Header */}
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

              {/* Data Value Node */}
              <div className="mt-4 space-y-1.5">
                <h3
                  className={`text-2xl font-black tracking-tight transition-colors ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {stat.value}
                </h3>

                {/* Subtext Context Indicator */}
                <div className="flex items-center gap-2 pt-0.5 min-w-0">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-md flex-shrink-0 ${
                      stat.isPositive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                    }`}
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
