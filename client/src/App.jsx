import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import Dashboard from "./pages/Dashboard.jsx";

import InterviewSetup from "./pages/InterviewSetup.jsx";
import InterviewSession from "./pages/InterviewSession.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import SettingsPage from "./pages/SettingPage.jsx";
import HistoryPage from "./pages/History.jsx";


export const ServerURL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export default function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // redux-persist ka rehydration track karo
  // state.user._persist.rehydrated === true hone ke baad hi routes render karo
  const rehydrated = useSelector(
    (state) => state.user?._persist?.rehydrated ?? false,
  );
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    //  Rehydration complete hone ka wait karo pehle
    if (!rehydrated) return;

    const restoreSession = async () => {
      try {
        const response = await axios.get(
          `${ServerURL}/api/v1/user/current-user`,
          { withCredentials: true },
        );

        if (response.data?.data?.name) {
          dispatch(setUserData(response.data.data));
        }
        //  catch mein null mat set karo — persist ka data rahega
      } catch (error) {
        // intentionally empty
      } finally {
        setChecking(false);
      }
    };

    restoreSession();
  }, [rehydrated, dispatch]); // ← rehydrated dependency add ki

  //  Dono conditions ka wait: rehydration + session check
  if (!rehydrated || checking) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 animate-pulse">
          Syncing Core Telemetry...
        </p>
      </div>
    );
  }

  const isUserAuthenticated = userData && userData.name;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
        }
      />
      <Route
        path="/auth"
        element={
          !isUserAuthenticated ? <Auth /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          isUserAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
        }
      />
      <Route path="/interview-setup" element={<InterviewSetup />} />
      <Route
        path="/interview/session/:sessionId"
        element={<InterviewSession />}
      />
      <Route path="/interview/report/:id" element={<ReportPage />} />
      <Route path="/reset-password" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      // Payment routes
      <Route path="/pricing" element={<PaymentPage />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailed />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}
