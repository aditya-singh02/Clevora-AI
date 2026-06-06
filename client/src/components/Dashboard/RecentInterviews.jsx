import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../ui/GlassCard.jsx"; // Universal structural framework uniformity
import {
  TbReportAnalytics,
  TbCircleCheck,
  TbAlertCircle,
  TbCalendarTime,
} from "react-icons/tb";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

// Format date → "2 days ago" style safely
function timeAgo(dateStr) {
  if (!dateStr) return "Recent Node";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    return "Just now";
  } catch (e) {
    return "Active Session";
  }
}

// Fixed Dynamic Score Metrics Scale to handle both 0-10 and 0-100 formats beautifully
function scoreColor(score) {
  if (!score || score === 0) return "text-slate-400";
  const normalized = score <= 10 ? score * 10 : score;
  if (normalized >= 80) return "text-emerald-400";
  if (normalized >= 50) return "text-amber-400";
  return "text-rose-400";
}

function scoreBg(score) {
  if (!score || score === 0) return "bg-slate-500/10 border-slate-500/10";
  const normalized = score <= 10 ? score * 10 : score;
  if (normalized >= 80) return "bg-emerald-500/10 border-emerald-500/10";
  if (normalized >= 50) return "bg-amber-500/10 border-amber-500/10";
  return "bg-rose-500/10 border-rose-500/10";
}

// ── DESKTOP TABLE ROW SYSTEM ───────────────────────────────────
function TableRow({ interview, dark, onView, index }) {
  const score = Number(interview.finalScore || interview.score) || 0;
  const currentStatus = (
    interview.status ||
    interview.interviewStatus ||
    "incomplete"
  ).toLowerCase();
  const isCompleted =
    currentStatus === "completed" || currentStatus === "success";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      className={`group border-b last:border-0 transition-colors duration-150 ${
        dark
          ? "border-white/[0.03] hover:bg-white/[0.01]"
          : "border-slate-100 hover:bg-slate-50/60"
      }`}
    >
      {/* Role Node */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              dark
                ? "bg-white/[0.02] border-white/[0.06] text-slate-400"
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
          >
            <TbReportAnalytics size={16} />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span
              className={`text-sm font-extrabold truncate block max-w-[150px] ${dark ? "text-white" : "text-slate-900"}`}
            >
              {interview.role || interview.jobTitle || "AI Assessment"}
            </span>
            <span
              className={`text-[10px] tracking-wide font-medium block uppercase ${dark ? "text-slate-500" : "text-slate-400"}`}
            >
              {interview.experience || "Standard"} Checkpoint
            </span>
          </div>
        </div>
      </td>

      {/* Mode Badge */}
      <td className="px-5 py-4 vertical-align-middle">
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
            (interview.mode || "").toLowerCase() === "technical"
              ? "bg-cyan-500/10 border-cyan-500/10 text-cyan-400"
              : "bg-purple-500/10 border-purple-500/10 text-purple-400"
          }`}
        >
          {interview.mode || "General"}
        </span>
      </td>

      {/* Dynamic Score Core Metric */}
      <td className="px-5 py-4 font-mono vertical-align-middle">
        {isCompleted ? (
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-black border ${scoreBg(score)} ${scoreColor(score)}`}
          >
            {score <= 10 ? `${score.toFixed(1)}/10` : `${score}%`}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/5 border border-amber-500/10 text-amber-500">
            —
          </span>
        )}
      </td>

      {/* Operational Evaluation Status */}
      <td className="px-5 py-4 vertical-align-middle">
        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <TbCircleCheck size={14} className="text-emerald-400" />
          ) : (
            <TbAlertCircle size={14} className="text-amber-400 animate-pulse" />
          )}
          <span
            className={`text-xs font-bold uppercase tracking-wider text-[10px] ${isCompleted ? "text-emerald-400" : "text-amber-400"}`}
          >
            {isCompleted ? "Completed" : "Pending Eval"}
          </span>
        </div>
      </td>

      {/* Relative Timestamp */}
      <td className="px-5 py-4 vertical-align-middle">
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}
        >
          <TbCalendarTime
            size={14}
            className={dark ? "text-slate-600" : "text-slate-400"}
          />
          {interview.createdAt ? timeAgo(interview.createdAt) : "—"}
        </div>
      </td>

      {/* Operation Direct Trigger View Link */}
      <td className="px-5 py-4 text-right vertical-align-middle">
        <motion.button
          onClick={() => onView(interview._id || interview.id, isCompleted)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all duration-200 ${
            isCompleted
              ? dark
                ? "text-white bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.08]"
                : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white shadow-sm hover:opacity-90"
          }`}
        >
          {isCompleted ? "Inspect" : "Resume"}
        </motion.button>
      </td>
    </motion.tr>
  );
}

// ── RESPONSIVE MOBILE CARD CONTAINER ──
function MobileCard({ interview, dark, onView, index }) {
  const score = Number(interview.finalScore || interview.score) || 0;
  const currentStatus = (
    interview.status ||
    interview.interviewStatus ||
    "incomplete"
  ).toLowerCase();
  const isCompleted =
    currentStatus === "completed" || currentStatus === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
        dark
          ? "bg-white/[0.01] border-white/[0.05]"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p
            className={`text-sm font-extrabold truncate ${dark ? "text-white" : "text-slate-900"}`}
          >
            {interview.role || interview.jobTitle || "AI Session"}
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {interview.createdAt ? timeAgo(interview.createdAt) : "—"}
          </p>
        </div>

        {isCompleted && (
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-black border flex-shrink-0 ${scoreBg(score)} ${scoreColor(score)}`}
          >
            {score <= 10 ? `${score.toFixed(1)}/10` : `${score}%`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
              (interview.mode || "").toLowerCase() === "technical"
                ? "bg-cyan-500/10 border-cyan-500/10 text-cyan-400"
                : "bg-purple-500/10 border-purple-500/10 text-purple-400"
            }`}
          >
            {interview.mode || "General"}
          </span>

          <div className="flex items-center gap-1">
            {isCompleted ? (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                Completed
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide animate-pulse">
                Pending
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onView(interview._id || interview.id, isCompleted)}
          className={`text-xs font-extrabold flex items-center gap-0.5 ${dark ? "text-indigo-400" : "text-indigo-600"}`}
        >
          {isCompleted ? "Inspect" : "Resume"}{" "}
          <MdOutlineKeyboardArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ── MAIN CORE LEAD MASTER COMPONENT ──
export default function RecentInterviews(props) {
  const { dark } = useTheme();
  const navigate = useNavigate();

  // BULLETPROOF HYDRATION DUAL STRATEGY: Reads plaintext array OR whole object map context
  const targetArray = props.interviews || props.user?.interviews || [];
  const loading = props.loading || false;

  // Show only latest 5 entries sorted chronologically
  const recent = [...targetArray]
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 5);

  // FIXED CORRECTION PATH: Correct plural route map target selection
  const handleView = (id, isCompleted) => {
    if (isCompleted) {
      navigate(`/reports/${id}`);
    } else {
      navigate(`/interview/simulation/${id}`);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Dynamic Header Controls Row */}
      <div className="flex items-center justify-between w-full">
        <h2
          className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-slate-500" : "text-slate-400"}`}
        >
          Recent Session Logs
        </h2>
        {targetArray.length > 5 && (
          <button
            onClick={() => navigate("/history")}
            className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5 group"
          >
            View Full Ledger
            <MdOutlineKeyboardArrowRight
              size={14}
              className="transform group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        )}
      </div>

      {/* Loading Pulsing Skeletons Frame */}
      {loading && (
        <div className="space-y-3 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-16 rounded-xl animate-pulse ${dark ? "bg-white/[0.02] border border-white/[0.04]" : "bg-slate-100 border border-slate-200"}`}
            />
          ))}
        </div>
      )}

      {/* Empty State Pipeline Fallback */}
      {!loading && recent.length === 0 && (
        <GlassCard
          padding="py-12"
          rounded="rounded-2xl"
          className={`text-center flex flex-col items-center justify-center space-y-4 border ${dark ? "border-white/[0.04]" : "border-slate-200"}`}
        >
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${dark ? "bg-white/[0.02] border-white/[0.06] text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}
          >
            <TbReportAnalytics size={22} className="text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <p
              className={`text-sm font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
            >
              No Interviews found
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Start your first AI interview to see your recent history and
              results here.
            </p>
          </div>
          <motion.button
            onClick={() => navigate("/interview/setup")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/10 hover:opacity-95"
          >
            Start First Interview
          </motion.button>
        </GlassCard>
      )}

      {/* Unified Main Core Content Display Table */}
      {!loading && recent.length > 0 && (
        <>
          {/* Desktop Table View Embedded beautifully inside shared Glass Context */}
          <GlassCard
            padding="p-0"
            rounded="rounded-2xl"
            className={`hidden sm:block overflow-hidden border ${dark ? "border-white/[0.04]" : "border-slate-200"}`}
          >
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr
                    className={`border-b text-[10px] uppercase tracking-wider font-bold ${
                      dark
                        ? "bg-white/[0.01] border-white/[0.04] text-slate-500"
                        : "bg-slate-50/50 border-slate-200 text-slate-400"
                    }`}
                  >
                    {[
                      "Role Profile",
                      "Execution Mode",
                      "Metric Score",
                      "Status",
                      "Timestamp",
                      "Operation",
                    ].map((h, index) => (
                      <th
                        key={h}
                        className={`px-5 py-4 ${index === 5 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.01]">
                  {recent.map((iv, i) => (
                    <TableRow
                      key={iv._id || iv.id || i}
                      interview={iv}
                      dark={dark}
                      onView={handleView}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Mobile Stacked Interactive Layout Matrix */}
          <div className="sm:hidden space-y-3 w-full">
            {recent.map((iv, i) => (
              <MobileCard
                key={iv._id || iv.id || i}
                interview={iv}
                dark={dark}
                onView={handleView}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
