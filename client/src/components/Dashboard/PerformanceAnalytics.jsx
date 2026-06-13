import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import GlassCard from "../ui/GlassCard.jsx";
import { useGetAllInterviews } from "../../hooks/useGetAllInterviews.js"; // 🚀 Hook Imported
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TbTrendingUp, TbLockOpen } from "react-icons/tb";

export default function PerformanceAnalytics() {
  const { dark } = useTheme();

  //  FETCH DATA VIA CUSTOM HOOK
  const { interviews, loading } = useGetAllInterviews();

  const completedInterviews = [...interviews]
    .filter((iv) => iv && iv.status === "Completed")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10); // Get last 10 completed interviews

  const hasData = completedInterviews.length > 0;

  const chartData = hasData
    ? completedInterviews.map((iv, index) => {
        const rawScore = Number(iv.finalScore || iv.score) || 0;
        const normalizedScore = rawScore <= 10 ? rawScore * 10 : rawScore;
        return {
          name: `Test 0${index + 1}`,
          score: normalizedScore,
          role: iv.role || "AI Simulation",
        };
      })
    : [
        { name: "Node 01", score: 0, role: "System Waiting" },
        { name: "Node 02", score: 0, role: "System Waiting" },
        { name: "Node 03", score: 0, role: "System Waiting" },
      ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && hasData) {
      return (
        <div
          className={`p-3 rounded-xl border font-sans shadow-xl backdrop-blur-md ${dark ? "bg-[#030712]/95 border-white/[0.08] text-white" : "bg-white/90 border-slate-200 text-slate-900"}`}
        >
          <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            {payload[0].payload.name}
          </p>
          <p className="text-sm font-black mt-0.5">
            Score: <span className="text-emerald-400">{payload[0].value}%</span>
          </p>
          <p
            className={`text-xs truncate max-w-[140px] mt-0.5 font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            {payload[0].payload.role}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-3 w-full">
        <div
          className={`h-[280px] rounded-2xl animate-pulse ${dark ? "bg-white/[0.02]" : "bg-slate-100"}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full block">
      <div className="flex items-center justify-between w-full">
        <h2
          className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-slate-500" : "text-slate-400"}`}
        >
          Performance Analytics
        </h2>
        <div
          className={`flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wide border transition-colors ${hasData ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/10" : "text-slate-400 bg-slate-500/5 border-slate-500/10"}`}
        >
          <TbTrendingUp size={12} />
          {hasData ? "Telemetry Active" : "Waiting for Data"}
        </div>
      </div>

      <GlassCard
        padding="p-5"
        rounded="rounded-2xl"
        className={`w-full border relative overflow-hidden ${dark ? "border-white/[0.04]" : "border-slate-200"}`}
      >
        <div className="w-full h-[240px] block relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="perfGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={hasData ? 0.2 : 0.01}
                  />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke={dark ? "#334155" : "#cbd5e1"}
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke={dark ? "#334155" : "#cbd5e1"}
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={
                  hasData
                    ? {
                        stroke: dark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                        strokeWidth: 1,
                      }
                    : false
                }
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke={hasData ? "#6366f1" : dark ? "#1e293b" : "#e2e8f0"}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#perfGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] bg-transparent pointer-events-none">
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-2xl transition-colors ${dark ? "bg-[#030712]/70 border-white/[0.06] text-slate-400" : "bg-white/70 border-slate-200 text-slate-500"}`}
            >
              <TbLockOpen size={14} className="text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold tracking-wide">
                Chart pending first Interview checkpoint
              </span>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
