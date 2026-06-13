// src/components/Interview/Report/ReportTopBar.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { IoArrowBack } from "react-icons/io5";
import {
  TbMicrophone2,
  TbBriefcase,
  TbCalendar,
  TbClock,
} from "react-icons/tb";

export default function ReportTopBar({ metaData = {} }) {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const {
    role = "Interview",
    mode = "Technical",
    createdAt,
    totalQuestions = 5,
    totalAnswered = 5,
  } = metaData;

  const date = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const chips = [
    { Icon: TbBriefcase, label: role },
    { Icon: TbMicrophone2, label: mode },
    { Icon: TbCalendar, label: date },
    { Icon: TbClock, label: `${totalAnswered}/${totalQuestions} answered` },
  ];

  return (
    <div
      className={`sticky top-0 z-20 px-5 py-3 border-b transition-colors duration-300 ${
        dark
          ? "bg-[#030712]/90 border-white/[0.07]"
          : "bg-white/90 border-slate-200"
      }`}
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Back button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors flex-shrink-0 ${
            dark
              ? "text-slate-400 hover:text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <IoArrowBack size={16} />
          Dashboard
        </motion.button>

        {/* Divider */}
        <div
          className={`hidden sm:block w-px h-5 ${dark ? "bg-white/[0.1]" : "bg-slate-200"}`}
        />

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <div
              key={c.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                dark
                  ? "bg-white/[0.04] border-white/[0.07] text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <c.Icon size={12} className="flex-shrink-0" />
              {c.label}
            </div>
          ))}
        </div>

        {/* Report label */}
        <div className="sm:ml-auto flex-shrink-0">
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            Interview Report
          </span>
        </div>
      </div>
    </div>
  );
}
