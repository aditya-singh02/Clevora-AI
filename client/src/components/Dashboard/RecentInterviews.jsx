import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../ui/GlassCard.jsx";
import { useGetAllInterviews } from "../../hooks/useGetAllInterviews.js"; // 🚀 Hook Imported
import {
  TbHistory,
  TbArrowUpRight,
  TbCircleCheck,
  TbAlertCircle,
} from "react-icons/tb";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function scoreColor(score) {
  if (score >= 8) return "text-emerald-400"; // Acche marks par Green
  if (score >= 5) return "text-amber-400"; // Average par Yellow
  return "text-red-500"; // 5 se kam par Red!
}

export default function RecentInterviews() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  // 🚀 FETCH DATA VIA CUSTOM HOOK
  const { interviews, loading } = useGetAllInterviews();

  const recentSessions = [...interviews]
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-3 w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-16 rounded-xl animate-pulse ${dark ? "bg-white/[0.02]" : "bg-slate-100"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <GlassCard
        padding="p-5"
        rounded="rounded-2xl"
        className={`border flex flex-col h-full ${dark ? "border-white/[0.04]" : "border-slate-200 shadow-sm"}`}
      >
        {/* Header Block inside Container */}
        <div className="flex items-center justify-between border-b pb-4 mb-4 w-full border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6C63FF] shadow-sm shadow-[#6C63FF]/50" />
            <h2
              className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Recent Sessions
            </h2>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${dark ? "bg-white/[0.03] text-slate-500" : "bg-slate-100 text-slate-400"}`}
          >
            {interviews.length} Total
          </span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-medium">
            No recent interview sessions found.
          </div>
        ) : (
          <div className="space-y-2.5 flex-1 w-full">
            {recentSessions.map((item) => {
              const isCompleted = item.status?.toLowerCase() === "completed";
              return (
                <div
                  key={item._id}
                  onClick={() =>
                    (window.location.href = `/interview/report/${item._id}`)
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 group ${dark ? "bg-[#070b16]/30 border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.07]" : "bg-slate-50/60 border-slate-100 hover:bg-slate-100/50"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <TbCircleCheck size={16} className="text-emerald-400" />
                      ) : (
                        <TbAlertCircle
                          size={16}
                          className="text-amber-400 animate-pulse"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate transition-colors ${dark ? "text-white group-hover:text-[#6C63FF]" : "text-slate-900 group-hover:text-[#6C63FF]"}`}
                      >
                        {item.role || "Software Engineer"}
                      </p>
                      <p className="text-[10px] font-semibold mt-0.5 tracking-wide text-slate-500">
                        <span className="uppercase">{item.mode}</span> • Exp:{" "}
                        {item.experience || "Fresher"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {isCompleted ? (
                      <div className="text-right">
                        <span
                          className={`text-xs font-black font-mono ${scoreColor(Number(item.finalScore))}`}
                        >
                          {Number(item.finalScore).toFixed(1)}
                        </span>
                        <span className="text-slate-500 font-medium text-[10px]">
                          /10
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-extrabold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/10 px-2 py-0.5 rounded-md">
                        In Progress
                      </span>
                    )}
                    <TbArrowUpRight
                      size={13}
                      className="text-slate-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {interviews.length > 4 && (
          <motion.button
            onClick={() => navigate("/history")}
            whileHover={{ scale: 1.002 }}
            whileTap={{ scale: 0.998 }}
            className={`w-full py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all duration-150 mt-4 ${dark ? "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.03] hover:text-white" : "bg-slate-100/50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <TbHistory size={14} className="text-indigo-400" />
            Show Full Interview History Ledger ({interviews.length} Sessions)
            <MdOutlineKeyboardArrowRight size={15} className="text-slate-500" />
          </motion.button>
        )}
      </GlassCard>
    </div>
  );
}
