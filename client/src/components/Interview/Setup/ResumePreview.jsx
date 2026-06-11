// src/components/Interview/Setup/ResumePreview.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  TbBriefcase,
  TbCode,
  TbLayersIntersect,
  TbFileCheck,
  TbRefresh,
} from "react-icons/tb";

export default function ResumePreview({
  config,
  onUpdateField,
  file,
  onReset,
}) {
  if (!config?.role) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 p-7 rounded-2xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-2xl shadow-2xl flex flex-col justify-between h-full overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="space-y-6">
        {/* COMPACT FILE STATUS BADGE */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/[0.04] shadow-inner">
          <div className="flex items-center gap-3 truncate max-w-[75%]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md">
              <TbFileCheck size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-black text-slate-200 truncate">
                {file?.name || "Resume.pdf"}
              </p>
              {/* 🚨 CHANGED: Simple user language */}
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Resume Connected Successfully
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
          >
            <TbRefresh size={14} /> Change File
          </button>
        </div>

        {/* 1. Target Job Role */}
        <div className="space-y-2">
          {/* 🚨 CHANGED: Target Profile Role -> Target Job Role */}
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <TbBriefcase size={16} className="text-indigo-400" /> Target Job
            Role
          </label>
          <input
            type="text"
            value={config.role}
            onChange={(e) => onUpdateField("role", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/[0.05] text-sm text-slate-200 font-bold focus:outline-none focus:border-indigo-500/40 transition-colors shadow-inner"
          />
        </div>

        {/* 2. Your Skills */}
        <div className="space-y-2">
          {/* 🚨 CHANGED: Extracted Skill Matrix -> Your Skills */}
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <TbCode size={16} className="text-emerald-400" /> Your Skills
          </label>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
            {config.skills?.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-black px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-slate-300 uppercase tracking-wide shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Your Projects */}
        <div className="space-y-2">
          {/* 🚨 CHANGED: Verified Project Contexts -> Your Projects */}
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <TbLayersIntersect size={16} className="text-cyan-400" /> Your
            Projects
          </label>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {config.projects?.map((proj, index) => {
              const displayTitle =
                typeof proj === "string"
                  ? proj
                  : proj?.title || `Project ${index + 1}`;
              const displayDesc =
                typeof proj === "object"
                  ? proj?.description || proj?.desc
                  : null;

              return (
                <div
                  key={index}
                  className="text-xs font-medium p-4 rounded-xl bg-slate-950/40 border border-white/[0.03] text-slate-400 hover:border-white/[0.06] transition-all flex flex-col gap-1 shadow-md"
                >
                  <span className="font-black text-slate-200 text-sm truncate">
                    {displayTitle}
                  </span>
                  {displayDesc && (
                    <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
