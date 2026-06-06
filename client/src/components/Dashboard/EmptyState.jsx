import React from "react";
import { motion } from "framer-motion";
import { TbFolderOff } from "react-icons/tb";
import GlassCard from "./GlassCard.jsx";

export default function EmptyState({
  title = "No Data Available",
  description = "Bhai, abhi yahan par koi records nahi mile hain.",
  icon: Icon = TbFolderOff,
  actionText,
  onAction,
}) {
  return (
    <div className="w-full flex items-center justify-center py-12 px-4">
      <GlassCard
        hover={false}
        className="max-w-md w-full p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/[0.04] bg-white/[0.01]"
      >
        {/* Ambient background accent glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Animated Icon Shell */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] flex items-center justify-center text-slate-400 mb-5 shadow-xl"
        >
          <Icon size={28} className="text-slate-400/80" />
        </motion.div>

        {/* Text Details Stack */}
        <div className="space-y-2 max-w-sm">
          <h3 className="text-base font-bold text-slate-200 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Conditional Action Call-To-Action (CTA) */}
        {actionText && onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="mt-6 text-xs font-bold px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors duration-200 border border-indigo-400/20 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
          >
            {actionText}
          </motion.button>
        )}
      </GlassCard>
    </div>
  );
}
