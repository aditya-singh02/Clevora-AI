import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  glowColor = "rgba(99,102,241,0.15)",
  padding = "p-6",
  rounded = "rounded-2xl",
}) {
  const { dark } = useTheme();

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={`${padding} ${rounded} border transition-all duration-300 ${
        dark
          ? "bg-white/[0.025] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04]"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
      } ${className}`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        ...(glow && {
          boxShadow: `0 0 32px ${glowColor}, 0 4px 24px rgba(0,0,0,0.1)`,
        }),
      }}
    >
      {children}
    </motion.div>
  );
}
