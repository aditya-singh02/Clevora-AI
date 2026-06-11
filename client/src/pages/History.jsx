import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";
import {
  BsClockHistory,
  BsSearch,
  BsSliders,
  BsEye,
  BsExclamationTriangle,
  BsCheckCircleFill,
  BsHourglassSplit,
  BsXCircle,
} from "react-icons/bs";

function scoreColor(score) {
  if (score >= 8) return "text-emerald-400"; // Acche marks par Green
  if (score >= 5) return "text-amber-400"; // Average par Yellow
  return "text-red-500"; // 5 se kam par Red!
}
      
export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviews, setInterviews] = useState([]);

  // Search aur Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const glowData = useCursorGlow() || {};
  const { x, y, ...cursorHandlers } = glowData;
  const serverUrl = import.meta.env.VITE_SERVER_URL || "";

  // 📡 Backend Core Controller Sync
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${serverUrl}/api/v1/interview/get-my-interviews`,
          { withCredentials: true },
        );

        if (isMounted && res.data?.success && Array.isArray(res.data.data)) {
          setInterviews(res.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load past interview sessions.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [serverUrl]);

  // 🎛️ Filter aur Search Logic
  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch = item.role
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") {
      return {
        text: "Completed",
        style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        Icon: BsCheckCircleFill,
      };
    }
    if (s === "pending" || s === "processing") {
      return {
        text: "In Progress",
        style: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        Icon: BsHourglassSplit,
      };
    }
    return {
      text: "Failed",
      style: "bg-red-500/10 border-red-500/20 text-red-400",
      Icon: BsXCircle,
    };
  };

  return (
    <div
      {...cursorHandlers}
      className="dark min-h-screen w-full bg-[#030712] text-slate-200 relative overflow-hidden select-none"
    >
      {/* Background Lights */}
      {x !== undefined && y !== undefined && (
        <div
          className="absolute pointer-events-none rounded-full opacity-10 blur-[130px] mix-blend-screen z-0 hidden sm:block"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <NeuralBg />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 md:px-14 py-14 space-y-8">
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="border-b border-white/[0.05] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <BsClockHistory size={20} className="text-[#6C63FF]" />
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                Interview Sessions History
              </h1>
            </div>
            <p className="text-xs text-slate-500 pl-8 mt-1">
              Review your past performances, scores, and evaluation records
            </p>
          </div>

          {/* Total Counter Badge */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 self-start md:self-auto">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Total Attempts
            </span>
            <span className="text-lg font-black text-[#6C63FF]">
              {interviews.length} Sessions
            </span>
          </div>
        </div>

        {/* ── SEARCH & FILTERS ROW ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <BsSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={13}
            />
            <input
              type="text"
              placeholder="Search by role (e.g. Frontend Engineer)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070b16]/40 border border-white/[0.05] rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-[#6C63FF]/50 placeholder-slate-600 transition-colors"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative shrink-0 flex items-center gap-2 bg-[#070b16]/40 border border-white/[0.05] rounded-xl px-3 py-1">
            <BsSliders size={12} className="text-slate-500 pl-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-400 focus:outline-none cursor-pointer pr-4 py-1.5"
            >
              <option value="all" className="bg-[#030712]">
                All Statuses
              </option>
              <option value="completed" className="bg-[#030712]">
                Completed
              </option>
              <option value="pending" className="bg-[#030712]">
                In Progress
              </option>
            </select>
          </div>
        </div>

        {/* ── HISTORY DATA LIST CONTAINER ─────────────────────────────────── */}
        <div>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
              <div className="h-4 w-4 rounded-full border border-white/20 border-t-[#6C63FF] animate-spin" />
              Loading history archives...
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-xs font-mono text-red-400 flex items-center gap-2">
              <BsExclamationTriangle size={14} className="shrink-0" />
              <span>⚠️ ERROR: {error}</span>
            </div>
          ) : filteredInterviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredInterviews.map((item) => {
                const badge = getStatusBadge(item.status);
                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150"
                  >
                    {/* Role & Core Details Block */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                          {item.role || "Software Engineer"}
                        </h3>
                        <span className="text-[10px] bg-white/[0.03] border border-white/[0.05] text-slate-400 px-2 py-0.5 rounded-md font-mono uppercase">
                          {item.mode || "AI Bot"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                        <span>Exp: {item.experience || "0"} Years</span>
                        <span className="text-white/[0.05]">•</span>
                        <span>Date: {formattedDate}</span>
                      </div>
                    </div>

                    {/* Score & Evaluation Actions Block */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/[0.03] sm:border-t-0 pt-3 sm:pt-0">
                      {/* Score Indicator */}
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Final Score
                        </span>
                        <span className="text-sm font-black">
                          {item.finalScore !== undefined &&
                          item.finalScore !== null ? (
                            <>
                              {/* 🔴 Sirf score value par dynamic/red color lagega */}
                              <span className={scoreColor(item.finalScore)}>
                                {item.finalScore}
                              </span>

                              {/* ⚪ /10 normal light gray color mein chhota dikhega */}
                              <span className="text-slate-200 font-black text-xs">
                                /10
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 shrink-0 ${badge.style}`}
                      >
                        <badge.Icon size={11} />
                        {badge.text}
                      </div>

                      {/* View Report Anchor Button */}
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = `/interview/report/${item._id}`)
                        }
                        className="bg-white/[0.03] hover:bg-[#6C63FF] text-slate-400 hover:text-white p-2.5 rounded-xl border border-white/[0.05] hover:border-transparent transition-all duration-150 active:scale-95 group"
                        title="View Full Dashboard Report"
                      >
                        <BsEye
                          size={14}
                          className="group-hover:scale-105 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-white/[0.04] rounded-2xl bg-white/[0.002]">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
                No matching history parameters cataloged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
