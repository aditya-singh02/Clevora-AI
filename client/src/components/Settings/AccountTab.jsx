import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // 🚀 Redux Integration
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  BsPerson,
  BsShieldLock,
  BsTrash,
  BsCheckCircle,
  BsExclamationTriangle,
  BsEnvelopeOpenFill,
} from "react-icons/bs";

import { clearUserData } from "../../redux/userSlice.js"; // 🚀 Clear User Data Action

export default function AccountTab() {
  const dispatch = useDispatch(); // 🚀 Redux Dispatch Hook
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [linkSentSuccess, setLinkSentSuccess] = useState(false);
  const [error, setError] = useState(null);

  // 📡 Direct extract user email from your active auth slice state nodes
  // Adjust 'state.auth.user' according to your exact store slice naming (e.g., state.user.currentUser)
const userState = useSelector((state) => state.user);
    const user = userState?.user || userState;
  const email = user?.userData?.email || "No email synchronized";

  console.log("user:", email); // Debug log to verify correct email extraction
  const serverUrl = import.meta.env.VITE_SERVER_URL || "";

  // ✉️ Trigger Secure Password Reset Email Link
  const handleRequestResetLink = async () => {
    setIsSendingLink(true);
    setError(null);
    setLinkSentSuccess(false);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );
      if (res.data?.success) setLinkSentSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not execute recovery mail delivery system.",
      );
    } finally {
      setIsSendingLink(false);
    }
  };

  //  Account Deletion Execution
  const handleDeleteProfile = async () => {
    if (
      !window.confirm(
        "CRITICAL WARNING: Terminate your profile permanently? This cannot be undone.",
      )
    )
      return;
    try {
      setError(null);
      const res = await axios.delete(
        `${serverUrl}/api/v1/user/delete-account`,
        { withCredentials: true },
      );
      if (res.data?.success) {
        dispatch(clearUserData());

        // 2. HARD CLEAR BROWSER STORAGE SESSIONS
        localStorage.clear();
        sessionStorage.clear();

        //3. REDIRECT TO ROOT OR LOGIN
        window.location.href = "/";
      }
    } catch (err) {
      setError("Failed processing account erasure request parameters.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/15 text-xs font-mono text-red-400 flex items-center gap-2"
          >
            <BsExclamationTriangle className="flex-shrink-0" size={14} />
            <span>⚠️ ERROR: {error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BsPerson className="text-[#6C63FF]" /> Account Details & Identity
          Management
        </h3>
        <div className="flex flex-col gap-1.5 max-w-md">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Identity Registered Email
          </label>
          <input
            type="email"
            disabled
            value={email}
            className="bg-white/[0.005] border border-white/5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed select-none focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BsShieldLock className="text-[#6C63FF]" /> Change Password
        </h3>
        <p className="text-[11px] text-slate-500 leading-normal max-w-lg">
          To change your password, click the button below to receive a reset
          link.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="button"
            onClick={handleRequestResetLink}
            disabled={isSendingLink}
            className="w-full sm:w-auto bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#6C63FF]/10 transition-all duration-200 flex items-center justify-center gap-2 text-nowrap"
          >
            {isSendingLink ? (
              <>
                {" "}
                <div className="h-3 w-3 rounded-full border border-white/20 border-t-white animate-spin" />{" "}
                Dispatching Link...{" "}
              </>
            ) : (
              <>
                {" "}
                <BsEnvelopeOpenFill size={11} /> Send Password Reset Email{" "}
              </>
            )}
          </button>
          {linkSentSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold leading-normal">
              <BsCheckCircle /> Check user inbox channels.
            </span>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-red-500/10 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
          <BsTrash /> Delete account
        </h3>
          <h1 className="text-[12px] text-slate-500 leading-normal max-w-lg">
            Permanently deletes your account, all interview data, and unused
            credits. This action cannot be undone.
          </h1>
        <button
          type="button"
          onClick={handleDeleteProfile}
          className="w-full sm:w-auto border border-red-500/400 hover:bg-red-500/40 text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all text-center"
        >
          Delete My Account Permanently
        </button>
      </div>
    </motion.div>
  );
}
