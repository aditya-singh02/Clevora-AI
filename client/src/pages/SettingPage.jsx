import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux"; // 🚀 Redux action fire karne ke liye
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";
import {
  BsPerson,
  BsCoin,
  BsBell,
  BsChevronRight,
  BsBoxArrowLeft,
} from "react-icons/bs"; // 🚀 Added BoxArrow icon
import AccountTab from "../components/Settings/AccountTab.jsx";
import BillingTab from "../components/Settings/BillingTab.jsx";
import NotificationsTab from "../components/Settings/NotificationTab.jsx";

// 🚀 Apne slice se clear action ko import karo
import { clearUserData } from "../redux/userSlice.js";

const TABS = [
  {
    id: "account",
    label: "Account",
    sub: "Email, password, security",
    Icon: BsPerson,
  },
  {
    id: "billing",
    label: "Billing & Credits",
    sub: "Balance, history, plans",
    Icon: BsCoin,
  },
  {
    id: "notifications",
    label: "Notifications",
    sub: "Emails and alerts",
    Icon: BsBell,
  },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query State Synchronizer
  const queryTab = searchParams.get("tab");
  const initialTab = TABS.some((t) => t.id === queryTab) ? queryTab : "account";

  const [activeTab, setActiveTab] = useState(initialTab);
  const glowData = useCursorGlow() || {};
  const { x, y, ...cursorHandlers } = glowData;

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  const active = TABS.find((t) => t.id === activeTab);

  //  LOGOUT CLEANUP CONTROLLER
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out of your session?"))
      return;

    // 1. Reset dynamic Redux memory slice values back to null
    dispatch(clearUserData());

    // 2. Clear token or route storage entries cached by browser
    localStorage.clear();
    sessionStorage.clear();

    // 3. Eject session mapping back to entry gates
    window.location.href = "/";
  };

  return (
    <div
      {...cursorHandlers}
      className="dark min-h-screen w-full bg-[#030712] text-slate-200 relative overflow-hidden select-none"
    >
      {/* Cursor glow */}
      {x !== undefined && y !== undefined && (
        <div
          className="absolute pointer-events-none rounded-full opacity-10 blur-[130px] mix-blend-screen z-0 hidden sm:block"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Neural background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <NeuralBg />
      </div>

      {/* ── Page shell ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen">
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-white/[0.05] bg-[#070b16]/80 pt-14 pb-8 px-4 shrink-0">
          {/* Sidebar header */}
          <div className="px-3 mb-6">
            <p className="text-[15px] uppercase tracking-widest font-semibold text-slate-500">
              Settings
            </p>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    text-left transition-all duration-150
                    ${
                      isActive
                        ? "bg-white/[0.06] text-slate-100"
                        : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`w-0.5 h-5 rounded-full shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-[#6C63FF]"
                        : "bg-transparent group-hover:bg-white/10"
                    }`}
                  />

                  {/* Icon */}
                  <tab.Icon
                    size={15}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-[#6C63FF]"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  />

                  {/* Label + sub */}
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-semibold leading-tight ${isActive ? "text-slate-100" : ""}`}
                    >
                      {tab.label}
                    </span>
                    <span className="text-[11px] text-slate-600 group-hover:text-slate-500 leading-tight mt-0.5 truncate">
                      {tab.sub}
                    </span>
                  </div>

                  {/* Chevron on active */}
                  {isActive && (
                    <BsChevronRight
                      size={11}
                      className="ml-auto text-slate-600 shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* FIXED BOTTOM SIDEBAR LOGOUT ACTION LINK */}
          {/* mt-auto expands height gap vertically pushing this button exactly to the layout base footer */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto w-full flex items-center gap-3 px-6 py-3.5 rounded-xl text-left font-semibold text-xs text-red-400/70 hover:bg-red-500/5 hover:text-red-400 transition-all duration-150 border border-transparent hover:border-red-500/10"
          >
            <BsBoxArrowLeft
              size={15}
              className="shrink-0 text-red-400/60 group-hover:text-red-400"
            />
            <div className="flex flex-col">
              <span className="leading-none">Sign Out Session</span>
            </div>
          </button>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Top bar — breadcrumb + active section title */}
          <div className="sticky top-0 z-20 flex items-center gap-3 px-8 py-4 border-b border-white/[0.05] bg-[#030712]/80 backdrop-blur-xl">
            <span className="text-[13px] text-slate-600 uppercase tracking-widest font-semibold">
              Settings
            </span>
            <BsChevronRight size={10} className="text-slate-700" />
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
              {active?.label}
            </span>
          </div>

          {/* Mobile tab row — shows only on small screens */}
          <div className="flex md:hidden gap-1 px-4 pt-5 pb-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#6C63FF] text-white"
                    : "text-slate-500 bg-white/[0.03] hover:text-slate-300"
                }`}
              >
                <tab.Icon size={13} />
                {tab.label}
              </button>
            ))}
            {/* Mobile Logout option inline stream link */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap text-red-400 bg-red-500/5 hover:bg-red-500/10"
            >
              <BsBoxArrowLeft size={13} />
              Logout
            </button>
          </div>

          {/* Canvas content area */}
          <div className="flex-1 px-6 sm:px-10 md:px-16 py-12 max-w-5xl w-full">
            {/* Section heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                {active && <active.Icon size={18} className="text-[#6C63FF]" />}
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  {active?.label}
                </h1>
              </div>
            </div>

            {/* Tab content view */}
            <div className="w-full">
              {activeTab === "account" && <AccountTab />}
              {activeTab === "billing" && <BillingTab />}
              {activeTab === "notifications" && <NotificationsTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
