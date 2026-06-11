import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../ui/GlassCard.jsx";
import { TbMicrophone2, TbCoin, TbArrowRight } from "react-icons/tb";

// 🚀 Fixed actions matrix with super simple text strings
const actions = [
  {
    title: "Start AI Interview",
    desc: "Upload your resume, choose your favorite role, and start your smart AI practice session right away.",
    Icon: TbMicrophone2,
    color: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20",
    glow: "rgba(99, 102, 241, 0.04)",
    border: "rgba(99, 102, 241, 0.15)",
    path: "/interview-setup",
    primary: true,
  },
  {
    title: "Buy Token Credits",
    desc: "Add more credits to your balance instantly so you never run out of interview attempts.",
    Icon: TbCoin,
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
    glow: "rgba(245, 158, 11, 0.03)",
    border: "rgba(245, 158, 11, 0.12)",
    path: "/pricing",
    primary: false,
  },
];

export default function QuickActions() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 w-full">
      {/* 🌟 Section Head Title changed to simple vocabulary */}
      <h2
        className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-slate-500" : "text-slate-400"}`}
      >
        Quick Actions
      </h2>

      {/* Grid Layout Frame */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {actions.map((a, i) => {
          const IconComponent = a.Icon;

          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="h-full cursor-pointer"
              onClick={() => navigate(a.path)}
            >
              <GlassCard
                hover={true}
                padding="p-6"
                rounded="rounded-2xl"
                className="relative overflow-hidden flex flex-col justify-between h-full group border transition-all duration-300 min-w-0"
                style={{
                  borderColor: dark ? a.border : undefined,
                  background: dark
                    ? `linear-gradient(135deg, ${a.glow}, transparent)`
                    : undefined,
                }}
              >
                {/* Micro Ambient Radial Background Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 20% 20%, ${a.glow}, transparent 65%)`,
                  }}
                />

                <div className="space-y-4 relative z-10 w-full">
                  {/* Icon Node Container */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${a.shadow}`}
                    style={{
                      background: `linear-gradient(135deg, ${dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}, ${a.glow})`,
                      border: `1px solid ${a.border}`,
                    }}
                  >
                    <div
                      className={`bg-gradient-to-br ${a.color} text-white p-2 rounded-lg`}
                    >
                      <IconComponent size={18} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Operational Content Messaging */}
                  <div className="space-y-1.5">
                    <h3
                      className={`text-base font-extrabold tracking-tight transition-colors ${dark ? "text-white" : "text-slate-900"}`}
                    >
                      {a.title}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed transition-colors ${dark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {a.desc}
                    </p>
                  </div>
                </div>

                {/* Lower Action Row */}
                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between w-full relative z-10">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}
                  >
                    Explore
                  </span>

                  {/* Arrow Movement Animation */}
                  <motion.div
                    className={`flex items-center justify-center bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    <TbArrowRight
                      size={14}
                      strokeWidth={3}
                      className="text-indigo-400 group-hover:translate-x-1 transition-transform"
                      style={{ color: dark ? undefined : "currentColor" }}
                    />
                  </motion.div>
                </div>

                {/* Recommended Badge */}
                {a.primary && (
                  <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/10">
                    Recommended
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
