import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import axios from "axios"; // Added for seamless backend session wipe
import { useTheme } from "../../context/ThemeContext.jsx";
import { setUserData } from "../../redux/userSlice"; // FIXED: Correct verified named import
import { ServerURL } from "../../App.jsx"; // Centralized gate source link
import {
  TbHome,
  TbMicrophone2,
  TbHistory,
  TbCoin,
  TbSettings,
  TbLogout,
  TbSun,
  TbMoon,
} from "react-icons/tb";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: TbHome },
  { label: "New Interview", path: "/interview-setup", icon: TbMicrophone2 },
  { label: "History", path: "/history", icon: TbHistory },
  { label: "Credits", path: "/pricing", icon: TbCoin },
  { label: "Settings", path: "/settings", icon: TbSettings },
];

export default function Sidebar({ user, isMobile = false, closeMobileMenu }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      // 1. Wipe HTTP-Only cookie sequence from the browser memory
      await axios.post(
        `${ServerURL}/api/v1/user/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Session logout endpoint trace failed:", error);
    } finally {
      // 2. Clear Redux pipeline instantly to lock the UI shell
      dispatch(setUserData(null));

      // 3. Clear storage tokens if anything was cached
      localStorage.removeItem("token");

      // 4. Mobile responsive layout closing check
      if (isMobile && closeMobileMenu) closeMobileMenu();

      // 5. FIXED: Direct hard redirect to Root landing node ("/") instead of phantom "/logout"
      navigate("/", { replace: true });
    }
  };

  return (
    <aside
      className={`relative h-full flex flex-col transition-all duration-300 ${dark ? "bg-white/[0.015] border-r border-white/[0.06]" : "bg-slate-50 border-r border-slate-200"} ${isMobile ? "w-full" : "w-20 lg:w-64"}`}
    >
      {/* 1. BRANDING */}
      <div
        className={`h-20 flex items-center px-6 mb-4 ${!isMobile && "justify-center lg:justify-start"}`}
      >
        <div className="flex items-center gap-3 text-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <span className="font-bold text-xl">C</span>
          </div>
          <span
            className={`font-bold text-xl tracking-tight transition-opacity ${dark ? "text-white" : "text-slate-900"} ${isMobile ? "block" : "hidden lg:block"}`}
          >
            Clevora<span className="text-indigo-400">.</span>
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            active={isActive(item.path)}
            isMobile={isMobile}
            dark={dark}
          />
        ))}
      </nav>

      {/* 3. BOTTOM PANEL ACTIONS */}
      <div
        className={`p-4 mt-auto border-t space-y-4 ${dark ? "border-white/[0.06]" : "border-slate-200"}`}
      >
        {/* THEME SWITCH CONTROL */}
        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border ${dark ? "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-amber-400" : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600 shadow-sm"}`}
        >
          <div className="flex-shrink-0">
            {dark ? <TbSun size={20} /> : <TbMoon size={20} />}
          </div>
          <span
            className={`text-sm font-semibold ${isMobile ? "block" : "hidden lg:block"}`}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* METADATA PROFILE BLOCK */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition-all relative group ${!isMobile && "justify-center lg:justify-start"}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-xs font-medium text-slate-300">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div
            className={`flex-1 min-w-0 ${isMobile ? "block" : "hidden lg:block"}`}
          >
            <p
              className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-900"}`}
            >
              {user?.name || "Aditya"}
            </p>
            <button
              onClick={handleLogout}
              className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-rose-500 transition-colors pt-0.5"
            >
              <TbLogout size={12} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

const NavItem = ({ item, active, isMobile, dark }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-bold" : `${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"} border border-transparent`} ${!isMobile && "md:justify-center lg:justify-start"}`}
    >
      <Icon size={22} className="flex-shrink-0" />
      <span
        className={`text-sm font-medium ${isMobile ? "block" : "hidden lg:block"}`}
      >
        {item.label}
      </span>
    </Link>
  );
};
