// src/components/Home/Navbar.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../../redux/userSlice.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { HiMenu, HiX } from "react-icons/hi";
import { RiCoinLine } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { TbBrain } from "react-icons/tb";
import { FaRegFileAlt } from "react-icons/fa";
import { IoMdPricetags } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";

const SERVER = import.meta.env.VITE_SERVER_URL;

const navLinks = [
  { label: "Features", href: "#features", Icon: BsLightningChargeFill },
  { label: "How it works", href: "#how-it-works", Icon: TbBrain },
  { label: "Pricing", href: "#pricing", Icon: IoMdPricetags },
  { label: "FAQ", href: "#faq", Icon: BiMessageSquareDetail },
];

export default function Navbar({ onLogin, onSignup, variant = "landing" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { userData } = useSelector((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${SERVER}/api/v1/auth/logout`, {
        withCredentials: true,
      });
    } finally {
      dispatch(setUserData(null));
      navigate("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={
        scrolled
          ? {
              background: dark ? "rgba(3,7,18,0.85)" : "rgba(248,250,252,0.85)",
              backdropFilter: "blur(20px)",
              borderBottom: dark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 12px rgba(99,102,241,0.4)",
                  "0 0 28px rgba(139,92,246,0.6)",
                  "0 0 12px rgba(99,102,241,0.4)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              C
            </motion.div>
            <span
              className={`font-extrabold text-xl tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
            >
              Clevora
            </span>
          </a>

          {/* Desktop nav links */}
          {variant === "landing" && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      dark
                        ? "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  <Icon size={13} className="opacity-70" />
                  {label}
                </a>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark/Light toggle */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  dark
                    ? "bg-white/[0.06] border border-white/[0.1] text-slate-400 hover:text-yellow-300"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600"
                }`}
            >
              {dark ? <MdLightMode size={16} /> : <MdDarkMode size={16} />}
            </motion.button>

            {userData ? (
              <>
                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <RiCoinLine size={13} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">
                    {userData.credits}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                  >
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200
                    ${dark ? "text-slate-400 border-white/[0.08] hover:text-white hover:border-white/20" : "text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200
                    ${dark ? "text-slate-400 border-white/[0.08] hover:text-white hover:border-white/20 hover:bg-white/[0.04]" : "text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  Login
                </button>
                <motion.button
                  onClick={onSignup}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 text-sm font-bold text-white rounded-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                  }}
                >
                  Get Started Free
                </motion.button>
              </>
            )}

            {/* Mobile menu */}
            {variant === "landing" && (
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className={`md:hidden p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && variant === "landing" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${dark ? "bg-[#030712]/95 border-white/[0.06]" : "bg-white/95 border-slate-200"}`}
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 text-sm rounded-xl transition-all duration-200
                    ${dark ? "text-slate-400 hover:text-white hover:bg-white/[0.05]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
              {!userData && (
                <button
                  onClick={() => {
                    onLogin();
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-3 text-sm rounded-xl transition-all duration-200
                    ${dark ? "text-slate-400 hover:text-white hover:bg-white/[0.05]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
