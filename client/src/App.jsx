import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from './redux/userSlice.js';


export const ServerURL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export default function App() {
  const dispatch = useDispatch()
 
  // Redux se userData lo — null means logged out, object means logged in
  const { userData } = useSelector(state => state.user)
 
  // Jab tak session check ho raha hai — spinner dikhao
  // Warna pehle Home dikhega phir redirect hoga (flickering)
  const [checking, setChecking] = useState(true)
 
  useEffect(() => {
    // ── SESSION RESTORE ────────────────────────────────────────
    // Har page reload pe yeh run hota hai
    // Backend ko cookie bhejta hai → verifyJWT middleware check karta hai
    // Cookie valid → user data return → Redux mein store
    // Cookie nahi/expire → 401 error → null store → Home dikhao
    const restoreSession = async () => {
      try {
        const response = await axios.get(
          `${SERVER}/api/v1/user/current-user`,
          { withCredentials: true } // ← cookie bhejne ke liye zaroori
        )
        // response.data = ApiResponse { statusCode, data, message, success }
        // response.data.data = actual user { _id, name, email, credits, ... }
        dispatch(setUserData(response.data.data))
      } catch {
        // 401 aaya → no valid cookie → user logged out
        dispatch(setUserData(null))
      } finally {
        setChecking(false)
      }
    }
    restoreSession()
  }, [dispatch])
 
  // Loading spinner — session check ho raha hai
  if (checking) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }
 
  return (
    <Routes>
      {/*
        "/" → agar logged in hai → /dashboard
               agar nahi → Home page (landing + auth modal)
      */}
      <Route
        path="/"
        element={ <Home /> }
      />

    <Route path="/auth" element={!userData ? <Auth /> : <Navigate to="/" replace />} />

      {/*
        "/reset-password" → email link se aaya → Home load hoga
        Home.jsx mein useEffect URL check karta hai aur modal open karta hai
      */}
      <Route path="/reset-password" element={<Home />} />
 
      {/*
        "/dashboard" → protected → sirf logged in user access kar sakta hai
        Dashboard abhi nahi bana — baad mein banayenge
      */}
      <Route
        path="/dashboard"
        element={
          userData
            ? (
              <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <p className="text-white text-xl">
                  Welcome {userData.name}! Dashboard coming soon 🚀
                </p>
              </div>
            )
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  )
}
 
// export default App