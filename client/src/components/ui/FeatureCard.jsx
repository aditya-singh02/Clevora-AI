import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  bg,
  glow,
}) {
  const { dark } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`h-full p-6 rounded-2xl border transition-all duration-300 cursor-default
        ${
          dark
            ? "bg-white/[0.025] border-white/[0.07] hover:border-white/[0.15]"
            : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
        }`}
      style={{ backdropFilter: "blur(10px)" }}
    >
      {/* Icon box with glow */}
      <div
        className={`w-12 h-12 rounded-xl ${bg} border flex items-center justify-center mb-5 relative`}
        style={{ boxShadow: `0 0 20px ${glow}` }}
      >
        <Icon size={22} className={color} />
      </div>

      <h3
        className={`text-base font-bold mb-2 tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h3>
      <p
        className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}
      >
        {desc}
      </p>
    </motion.div>
  );
}
