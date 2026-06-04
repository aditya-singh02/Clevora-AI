// client/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Auth from "../pages/Auth.jsx";

 export default function Home() {
 
  // ── Modal state ──────────────────────────────────────────────
  // isOpen → modal dikhao ya nahi
  // view   → "login" | "register" | "forgot" | "reset"
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('login')
 
  // ── Reset password URL check ─────────────────────────────────
  // Jab user Gmail link click karta hai → /reset-password?token=xxx&email=xxx
  // Yeh useEffect URL params check karta hai aur automatically modal open karta hai
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('token') && params.get('email')) {
      setView('reset')
      setIsOpen(true)
    }
  }, [])
 
  // Open modal with specific view
  const openModal = (v) => {
    setView(v)
    setIsOpen(true)
  }
  // Close modal and clean URL params
  const handleClose = () => {
    setIsOpen(false);
    const params = new URLSearchParams(window.location.search); 
    if (params.get("token") || params.get("email") || window.location.pathname.includes("reset-password")) {
      window.history.replaceState({}, "", "/");
    }
  };
 
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* ── Background Effects ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left glow */}
        <div
          className="absolute w-[700px] h-[700px] -top-64 -left-48 rounded-full
          bg-indigo-600/[0.06] blur-[130px]"
        />
        {/* Bottom right glow */}
        <div
          className="absolute w-[600px] h-[600px] -bottom-48 -right-32 rounded-full
          bg-violet-600/[0.06] blur-[110px]"
        />
        {/* Center subtle glow */}
        <div
          className="absolute w-[400px] h-[400px] top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2 rounded-full
          bg-cyan-500/[0.03] blur-[90px]"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between
        px-6 sm:px-10 lg:px-16 py-5
        border-b border-white/[0.05]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(99,102,241,0.3)",
                "0 0 20px rgba(139,92,246,0.45)",
                "0 0 10px rgba(99,102,241,0.3)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600
              flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          >
            C
          </motion.div>
          <span className="text-white font-bold text-lg tracking-tight">
            Clevora
          </span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => openModal("login")}
            className="px-4 sm:px-5 py-2 text-sm font-medium text-slate-400
              border border-white/[0.08] rounded-xl
              hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04]
              transition-all duration-200"
          >
            Login
          </button>
          <motion.button
            onClick={() => openModal("register")}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 sm:px-5 py-2 text-sm font-semibold text-white rounded-xl
              bg-gradient-to-r from-indigo-600 to-violet-600
              hover:from-indigo-500 hover:to-violet-500
              hover:shadow-lg hover:shadow-indigo-500/25
              transition-all duration-200"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <main
        className="relative z-10 flex flex-col items-center justify-center
        min-h-[calc(100vh-74px)] px-6 py-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* ── Badge ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
              bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-indigo-400 font-medium tracking-wider uppercase">
              AI-Powered Interview Coach
            </span>
          </motion.div>

          {/* ── Main Heading ── */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-white
              leading-[1.04] tracking-[-2.5px] mb-6 max-w-3xl"
          >
            Practice smarter.
            <br />
            <span
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400
              bg-clip-text text-transparent"
            >
              Interview better.
            </span>
          </motion.h1>

          {/* ── Subheading ── */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-slate-400 text-lg sm:text-xl leading-relaxed
              max-w-lg mb-10 font-light"
          >
            Upload your resume. AI conducts a real voice interview based on your
            profile. Get instant feedback on every answer.
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-5"
          >
            <motion.button
              onClick={() => openModal("register")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 text-base font-semibold text-white rounded-xl
                bg-gradient-to-r from-indigo-600 to-violet-600
                hover:from-indigo-500 hover:to-violet-500
                hover:shadow-xl hover:shadow-indigo-500/30
                transition-all duration-200"
            >
              Start for Free →
            </motion.button>

            <motion.button
              onClick={() => openModal("login")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 text-base font-medium text-slate-300 rounded-xl
                border border-white/[0.1]
                hover:border-white/[0.22] hover:text-white hover:bg-white/[0.04]
                transition-all duration-200"
            >
              Sign In
            </motion.button>
          </motion.div>

          {/* Free credits note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-slate-700 mb-16"
          >
            🎁 100 free credits on signup — no credit card required
          </motion.p>

          {/* ── Feature Pills ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2.5 max-w-xl"
          >
            {[
              { icon: "📄", text: "Resume Analysis" },
              { icon: "🎙️", text: "Voice Interview" },
              { icon: "🤖", text: "AI Feedback" },
              { icon: "📊", text: "Score Report" },
              { icon: "🔒", text: "Integrity Monitor" },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="flex items-center gap-2 px-4 py-2
                  bg-white/[0.025] border border-white/[0.06] rounded-xl
                  text-sm text-slate-500
                  hover:text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.04]
                  transition-all duration-200 cursor-default"
              >
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* ── Auth Modal ─────────────────────────────────────────── */}
      {/*
        isOpen → modal dikhao
        onClose → modal band karo
        defaultView → kaunsa view pehle dikhao (login/register/reset)
      */}
      <Auth
        isOpen={isOpen}
        onClose={(handleClose)} 
        defaultView={view}
      />
    </div>
  );
}
 