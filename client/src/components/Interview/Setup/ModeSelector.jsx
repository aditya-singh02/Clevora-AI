import React from "react";
import { motion } from "framer-motion";
import { TbCpu, TbUsers } from "react-icons/tb";

export default function ModeSelector({ selectedMode, onModeChange }) {
  // Ultra-premium layout mapping variables configuration
  const modes = [
    {
      id: "Technical",
      label: "Technical Core",
      icon: TbCpu,
      desc: "Deep dive into DSA, core engineering stack, system design, and edge-case algorithms.",
      glow: "from-indigo-500/20 via-indigo-500/5 to-transparent",
      activeBorder:
        "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      iconColor: "text-indigo-400",
    },
    {
      id: "HR",
      label: "HR Behavioral",
      icon: TbUsers,
      desc: "Culture alignment, tactical real-world situations, project coordination, and confidence audits.",
      glow: "from-pink-500/20 via-pink-500/5 to-transparent",
      activeBorder:
        "border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)]",
      iconColor: "text-pink-400",
    },
  ];

  return (
    <div className="space-y-2.5 animate-fadeIn">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
        Simulation Category Mode
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMode === m.id;

          return (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onModeChange(m.id)}
              className={`p-4.5 rounded-2xl border cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-[130px] group ${
                isActive
                  ? `${m.activeBorder} bg-slate-900/80`
                  : "border-white/[0.05] bg-slate-950/40 hover:border-white/[0.12]"
              }`}
            >
              {/* Back-layer custom mesh glow on Active State */}
              {isActive && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.glow} opacity-60 pointer-events-none`}
                />
              )}

              {/* Top Layer: Icon + Selection status ring */}
              <div className="flex items-center justify-between relative z-10">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
                    isActive
                      ? "bg-white/5 border-white/10"
                      : "bg-white/[0.02] border-white/[0.04] group-hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`${isActive ? m.iconColor : "text-slate-500 group-hover:text-slate-400"} ${isActive && m.id === "Technical" ? "animate-spin-[spin_3s_linear_infinite]" : ""}`}
                  />
                </div>

                {/* Custom Holo-Checkbox dot indicator */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isActive ? "border-white bg-white" : "border-white/20"
                  }`}
                >
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>

              {/* Bottom Layer: Meta Description stack */}
              <div className="relative z-10">
                <h4
                  className={`text-xs font-bold transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}
                >
                  {m.label}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5 max-w-[210px] truncate-2-lines">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
