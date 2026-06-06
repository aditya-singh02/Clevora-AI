import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import axios from "axios";
import { setUserData } from "../redux/userSlice.js";
import { ServerURL } from "../App.jsx";
import App from "../App.jsx";

// React Icons
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoClose, IoArrowBack } from "react-icons/io5";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";
import {
  BsShieldCheck,
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs";
import { RiLoader4Line } from "react-icons/ri";

// ─── Backend URL from .env ─────────────────────────────────────────────────────

const SERVER = import.meta.env.VITE_SERVER_URL;

// ─── Password Rules (must match backend exactly) ──────────────────────────────
// Backend regex
const PWD_RULES = [
  { id: "len", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    id: "upper",
    label: "One uppercase letter (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  { id: "num", label: "One number (0-9)", test: (p) => /\d/.test(p) },
  {
    id: "spec",
    label: "One special char (@$!%*?&)",
    test: (p) => /[@$!%*?&]/.test(p),
  },
];

const isStrongPassword = (p) => PWD_RULES.every((r) => r.test(p));

// ─── Framer Motion Variants ───────
const overlayVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVar = {
  hidden: { opacity: 0, scale: 0.93, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.18 } },
};

const viewVar = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// ════════════════════════════════════════════════════════════════
//  SMALL REUSABLE PIECES
// ════════════════════════════════════════════════════════════════

// Input field with icon + optional eye toggle
function Field({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  showToggle,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1.8px]">
        {label}
      </label>
      <div className="relative group">
        {/* Left icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-200">
          <Icon size={15} />
        </div>
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl
            pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-700
            focus:outline-none focus:border-indigo-500/60
            focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]
            transition-all duration-200"
        />
        {/* Eye toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
          >
            {show ? (
              <AiOutlineEye size={16} />
            ) : (
              <AiOutlineEyeInvisible size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Password strength checker — shown below password field in register/reset
function StrengthChecker({ password }) {
  if (!password) return null;
  const passed = PWD_RULES.filter((r) => r.test(password)).length;
  const pct = (passed / PWD_RULES.length) * 100;
  const config =
    passed <= 1
      ? { label: "Weak", bar: "bg-red-500" }
      : passed <= 3
        ? { label: "Fair", bar: "bg-amber-500" }
        : passed <= 4
          ? { label: "Good", bar: "bg-blue-500" }
          : { label: "Strong", bar: "bg-emerald-500" };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2.5 space-y-2.5 overflow-hidden"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${config.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span
          className={`text-[11px] font-medium w-12 text-right
          ${passed <= 1 ? "text-red-400" : passed <= 3 ? "text-amber-400" : passed <= 4 ? "text-blue-400" : "text-emerald-400"}`}
        >
          {config.label}
        </span>
      </div>
      {/* Rule checklist */}
      <div className="grid grid-cols-1 gap-1">
        {PWD_RULES.map((r) => {
          const ok = r.test(password);
          return (
            <div key={r.id} className="flex items-center gap-2">
              {ok ? (
                <BsCheckCircleFill
                  size={11}
                  className="text-emerald-400 flex-shrink-0"
                />
              ) : (
                <BsXCircleFill
                  size={11}
                  className="text-slate-700 flex-shrink-0"
                />
              )}
              <span
                className={`text-[11px] ${ok ? "text-slate-400" : "text-slate-600"}`}
              >
                {r.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Feedback alert — error or success
function Alert({ type, msg }) {
  if (!msg) return null;
  const s =
    type === "error"
      ? "bg-red-500/[0.07] border-red-500/25 text-red-300"
      : "bg-emerald-500/[0.07] border-emerald-500/25 text-emerald-300";
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium leading-relaxed ${s}`}
    >
      {msg}
    </motion.div>
  );
}

// Primary gradient button
function PrimaryBtn({ loading, label, type = "submit", onClick }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide text-white
        bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600
        hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500
        hover:shadow-lg hover:shadow-indigo-500/25
        transition-all duration-200 flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <RiLoader4Line size={16} className="animate-spin" /> Please wait...
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}

// OR divider
function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-slate-800" />
      <span className="text-[11px] text-slate-600 uppercase tracking-[1.5px]">
        or
      </span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}

// Google OAuth button
function GoogleBtn({ onClick, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -1 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-full
        border border-slate-700/60 bg-slate-900/60 text-slate-200 text-sm font-medium
        hover:bg-slate-800/80 hover:border-slate-600
        hover:shadow-md transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed "
    >
      <FcGoogle size={18} />
      Continue with Google
    </motion.button>
  );
}

// Tab switcher (Login ↔ Register)
function Tabs({ active, onChange }) {
  return (
    <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1 mb-6">
      {["login", "register"].map((v) => (
        <button
          key={v}
          type="butto
          n"
          onClick={() => onChange(v)}
          className={`flex-1 py-2.5 rounded-[9px] text-[13px] font-medium
            transition-all duration-300
            ${
              active === v
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
            }`}
        >
          {v === "login" ? "Sign In" : "Create Account"}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  MAIN AUTH COMPONENT
// ════════════════════════════════════════════════════════════════

export default function Auth({ isOpen, onClose, defaultView = "login" }) {
  // ─── Redux & Router ────────────────────────────────────────────
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ─── View state ────────────────────────────────────────────────
  // "login" | "register" | "forgot" | "reset"
  const [view, setView] = useState(defaultView);

  // ─── Loading / Error / Success ─────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ─── Form values ───────────────────────────────────────────────
  const [lForm, setL] = useState({ email: "", password: "" });
  const [rForm, setR] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setReset] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  // ─── Password show/hide ────────────────────────────────────────
  const [show, setShow] = useState({
    lp: false,
    rp: false,
    rc: false,
    np: false,
    nc: false,
  });
  const toggle = (k) => setShow((p) => ({ ...p, [k]: !p[k] }));

  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ─── On mount: check URL for reset token ──────────────────────
  // When user clicks reset link in Gmail → URL has ?token=xxx&email=xxx
  useEffect(() => {
    if (isOpen) {
      // Reset password URL check
      const params = new URLSearchParams(window.location.search);
      if (params.get("token") && params.get("email")) {
        setView("reset");
      } else {
        setView(defaultView); // ← parent ne jo bola woh dikhao
      }
      // Forms clear
      clear();
      setL({ email: "", password: "" });
      setR({ name: "", email: "", password: "", confirmPassword: "" });
      setForgotEmail("");
      setShow({ lp: false, rp: false, rc: false, np: false, nc: false });
    }
  }, [isOpen, defaultView]);

  // ─── ESC to close ──────────────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // ─── OTP resend timer ─────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ─── Lock body scroll ──────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ─── Helpers ──────────────────────────────────────────────────
  const clear = () => {
    setError("");
    setSuccess("");
  };
  const switchView = (v) => {
    setView(v);
    clear();
    setL({ email: "", password: "" });
    setR({ name: "", email: "", password: "", confirmPassword: "" });
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setShow({ lp: false, rp: false, rc: false, np: false, nc: false });
  };

  // ════════════════════════════════════════════════════════════════
  //  BACKEND FUNCTIONS
  // ════════════════════════════════════════════════════════════════

  // ── A. Google Auth ─────────────────────────────────────────────
  // FLOW:
  // 1. Firebase popup → Google account picker
  // 2. Firebase returns user (displayName, email)
  // 3. POST to our backend /api/v1/auth/google
  // 4. Backend: find/create user → set JWT cookie → return user
  // 5. Redux stores user → navigate to /dashboard
  const handleGoogle = async () => {
    try {
      setLoading(true);
      clear();

      // Step 1-2: Firebase handles Google OAuth
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;

      // Step 3: Send to our Express backend
      // withCredentials:true → allows backend cookie to be SET in browser
      const { data } = await axios.post(
        `${SERVER}/api/v1/auth/google`,
        { name: displayName, email },
        { withCredentials: true },
      );

      // Step 4: data.data because ApiResponse wraps it:
      // response.data = { statusCode:200, data:{_id,name,email,credits}, message, success }
      // response.data.data = actual user object
      dispatch(setUserData(data.data));

      // Step 5: Close modal +   go to dashboard
      onClose();
      navigate("/dashboard");
    } catch (err) {
      // err.response.data.message = ApiError message from backend
      setError(
        err.response?.data?.message || "Google sign-in failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── B. Email Login ─────────────────────────────────────────────
  // FLOW:
  // 1. User submits email + password
  // 2. POST /api/v1/auth/login
  // 3. Backend: find user → bcrypt.compare password → set JWT cookie
  // 4. Redux stores user → navigate to /dashboard
  const handleLogin = async (e) => {
    e.preventDefault();
    clear();

    // Frontend validation (before hitting backend)
    if (!lForm.email || !lForm.password)
      return setError("Email and password are required.");

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${SERVER}/api/v1/auth/login`,
        { email: lForm.email, password: lForm.password },
        {
          withCredentials: true,
        }, // ← MUST — so backend cookie gets stored
      );

      dispatch(setUserData(data.data));
      onClose();
      navigate("/dashboard");
    } catch (err) {
      // Backend error messages (from auth.controller.js):
      // "User not found. Please register first."
      // "Invalid password"
      // "This account uses Google login..."
      // "Too many attempts..." (rate limiter)
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── C. Register ────────────────────────────────────────────────
  // FLOW:
  // 1. User submits name, email, password, confirmPassword
  // 2. Frontend validation (empty, password match, strength)
  // 3. POST /api/v1/auth/register
  // 4. Backend: validate → create user with hashed password + OTP → send OTP email
  // 5. Show success message + switch to OTP view (don't navigate yet)
  const handleRegister = async (e) => {
    e?.preventDefault();
    clear();
    const { name, email, password, confirmPassword } = rForm;
    if (!name || !email || !password || !confirmPassword)
      return setError("All fields are required.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (!isStrongPassword(password))
      return setError("Password must meet all requirements shown below.");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${SERVER}/api/v1/auth/register`,
        { name, email, password, confirmPassword },
        { withCredentials: true },
      );
      // Backend ab JWT nahi deta — sirf email return karta hai
      // OTP view pe jao
      setOtpEmail(email.toLowerCase());
      setResendTimer(30);
      setSuccess("OTP sent! Check your Gmail.");
      switchView("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── D. Forgot Password ─────────────────────────────────────────
  // FLOW:
  // 1. User submits email
  // 2. POST /api/v1/auth/forgot-password
  // 3. Backend: generate crypto token → hash → save → send email
  // 4. Show success message (don't navigate)
  const handleForgot = async (e) => {
    e.preventDefault();
    clear();
    if (!forgotEmail) return setError("Email is required.");

    try {
      setLoading(true);

      await axios.post(
        `${ServerURL}/api/v1/auth/forgot-password`,
        { email: forgotEmail },
        // No withCredentials needed — user not logged in here
      );

      setSuccess(
        "✅ Reset link sent! Check your Gmail inbox. Link expires in 15 minutes.",
      );
      setForgotEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  // ── E. Reset Password ──────────────────────────────────────────
  // FLOW:
  // 1. User clicked email link → came to /reset-password?token=xxx&email=xxx
  // 2. User fills newPassword + confirmNewPassword
  // 3. POST /api/v1/auth/reset-password (with token+email from URL)
  // 4. Backend: verify token → check history → update password
  // 5. Show success → auto switch to login
  const handleReset = async (e) => {
    e.preventDefault();
    clear();

    // Get token and email from URL (put there by backend email link)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    const { newPassword, confirmNewPassword } = resetForm;

    if (!newPassword || !confirmNewPassword)
      return setError("Both fields are required.");
    if (newPassword !== confirmNewPassword)
      return setError("Passwords do not match.");
    if (!isStrongPassword(newPassword))
      return setError("Password must meet all requirements shown below.");

    try {
      setLoading(true);

      await axios.post(`${ServerURL}/api/v1/auth/reset-password`, {
        email,
        token,
        newPassword,
        confirmNewPassword,
      });

      setSuccess("🎉 Password reset successfully! Redirecting to login...");

      // Clean URL + switch to login after 2 seconds
      setTimeout(() => {
        window.history.replaceState({}, "", window.location.pathname);
        switchView("login");
      }, 2000);
    } catch (err) {
      // Backend messages:
      // "Invalid or expired token"
      // "Cannot reuse last 3 passwords"
      setError(
        err.response?.data?.message || "Reset failed. Link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── F. Verify OTP ───────────────────────────────────────────────
  // FLOW:
  // 1. User fills 6-digit OTP sent to email
  // 2. POST /api/v1/auth/verify-otp with email+otp
  // 3. Backend: find user by email → compare OTP → if valid, set verified=true + JWT cookie
  // 4. Redux stores user → navigate to /
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    clear();
    const otpString = otp.join("");
    if (otpString.length !== 6)
      return setError("Please enter the complete 6-digit OTP.");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${SERVER}/api/v1/auth/verify-otp`,
        { email: otpEmail, otp: otpString },
        { withCredentials: true },
      );
      dispatch(setUserData(data.data));
      onClose();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  // OTP input change handler
  // allow only digit input, auto-move to next box, and handle backspace
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // sirf number
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Agla box focus
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace to move focus back
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // OTP resend
  // 1. User clicks "Resend OTP"
  // 2. POST /api/v1/auth/register again with same email (backend will detect existing unverified user and resend OTP without creating new user)
  // 3. Show success message + reset timer + clear OTP inputs
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      clear();
      const { data } = await axios.post(
        `${SERVER}/api/v1/auth/register`,
        {
          name: rForm.name || "User",
          email: otpEmail,
          password: rForm.password,
          confirmPassword: rForm.confirmPassword,
        },
        { withCredentials: true },
      );
      setSuccess("New OTP sent to your Gmail!");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch {
      setSuccess("New OTP sent!");
      setResendTimer(30);
    } finally {
      setResendLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <AnimatePresence>
      {isOpen && (
        // ── Overlay ──────────────────────────────────────────────
        <motion.div
          key="overlay"
          variants={overlayVar}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(2, 4, 12, 0.82)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* ── Modal Box ──────────────────────────────────────── */}
          <motion.div
            key="modal"
            variants={modalVar}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[430px] relative rounded-2xl
              border border-white/[0.06]
              overflow-hidden overflow-y-auto max-h-[92vh]"
            style={{
              background:
                "linear-gradient(145deg, rgba(10,14,26,0.98) 0%, rgba(7,10,20,0.98) 100%)",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px
              bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            />

            <div className="p-7 sm:p-8">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-5 right-5 w-8 h-8 rounded-lg
                  bg-white/[0.04] border border-white/[0.07]
                  flex items-center justify-center
                  text-slate-500 hover:text-slate-200
                  hover:bg-white/[0.09] transition-all duration-150"
              >
                <IoClose size={16} />
              </motion.button>

              {/* Logo */}
              <div className="flex items-center gap-2.5 mb-7">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 12px rgba(99,102,241,0.3)",
                      "0 0 22px rgba(139,92,246,0.45)",
                      "0 0 12px rgba(99,102,241,0.3)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-[34px] h-[34px] rounded-[10px] flex-shrink-0
                    bg-gradient-to-br from-indigo-500 to-violet-600
                    flex items-center justify-center
                    text-white font-bold text-[15px]"
                >
                  C
                </motion.div>
                <span className="text-white font-bold text-[17px] tracking-tight">
                  Clevora
                </span>
              </div>

              {/* ════════ VIEWS ════════ */}
              <AnimatePresence mode="wait">
                {/* ── LOGIN ── */}
                {view === "login" && (
                  <motion.div
                    key="login"
                    variants={viewVar}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Tabs active="login" onChange={switchView} />
                    <GoogleBtn onClick={handleGoogle} disabled={loading} />
                    <div className="my-4">
                      <Divider />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <Field
                        label="Gmail Address"
                        icon={HiOutlineMail}
                        type="email"
                        value={lForm.email}
                        onChange={(e) =>
                          setL((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="you@gmail.com"
                        autoComplete="email"
                      />

                      <Field
                        label="Password"
                        icon={HiOutlineLockClosed}
                        value={lForm.password}
                        onChange={(e) =>
                          setL((p) => ({ ...p, password: e.target.value }))
                        }
                        placeholder="Your password"
                        showToggle
                        show={show.lp}
                        onToggle={() => toggle("lp")}
                        autoComplete="current-password"
                      />

                      <div className="flex justify-end -mt-1">
                        <button
                          type="button"
                          onClick={() => switchView("forgot")}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Error shown here — comes from backend */}
                      <Alert type="error" msg={error} />

                      <PrimaryBtn loading={loading} label="Sign In →" />
                    </form>

                    <p className="text-center text-xs text-slate-600 mt-5">
                      No account?{" "}
                      <button
                        onClick={() => switchView("register")}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Create one free
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* ── REGISTER ── */}
                {view === "register" && (
                  <motion.div
                    key="register"
                    variants={viewVar}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Tabs active="register" onChange={switchView} />
                    <GoogleBtn onClick={handleGoogle} disabled={loading} />
                    <div className="my-4">
                      <Divider />
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3.5">
                      <Field
                        label="Full Name"
                        icon={HiOutlineUser}
                        value={rForm.name}
                        onChange={(e) =>
                          setR((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your Name"
                        autoComplete="name"
                      />

                      <Field
                        label="Gmail Address"
                        icon={HiOutlineMail}
                        type="email"
                        value={rForm.email}
                        onChange={(e) =>
                          setR((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="you@gmail.com"
                        autoComplete="email"
                      />

                      <div>
                        <Field
                          label="Password"
                          icon={HiOutlineLockClosed}
                          value={rForm.password}
                          onChange={(e) =>
                            setR((p) => ({ ...p, password: e.target.value }))
                          }
                          placeholder="Create strong password"
                          showToggle
                          show={show.rp}
                          onToggle={() => toggle("rp")}
                          autoComplete="new-password"
                        />
                        {/* Password rules checker — matches backend exactly */}
                        <StrengthChecker password={rForm.password} />
                      </div>

                      <Field
                        label="Confirm Password"
                        icon={HiOutlineLockClosed}
                        value={rForm.confirmPassword}
                        onChange={(e) =>
                          setR((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Repeat password"
                        showToggle
                        show={show.rc}
                        onToggle={() => toggle("rc")}
                        autoComplete="new-password"
                      />

                      <Alert type="error" msg={error} />

                      <PrimaryBtn loading={loading} label="Create Account →" />
                    </form>

                    <p className="text-center text-xs text-slate-600 mt-4">
                      Have an account?{" "}
                      <button
                        onClick={() => switchView("login")}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>

                    {/* Small note about gmail only — matches backend validation */}
                    <p className="text-center text-[10px] text-slate-700 mt-3">
                      Only @gmail.com addresses accepted
                    </p>
                  </motion.div>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {view === "forgot" && (
                  <motion.div
                    key="forgot"
                    variants={viewVar}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <button
                      onClick={() => switchView("login")}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <IoArrowBack size={13} /> Back to login
                    </button>

                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                        Forgot password?
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Enter your Gmail — we'll send a reset link valid for 15
                        minutes.
                      </p>
                    </div>

                    <form onSubmit={handleForgot} className="space-y-4">
                      <Field
                        label="Gmail Address"
                        icon={HiOutlineMail}
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        autoComplete="email"
                      />

                      <Alert type="error" msg={error} />
                      <Alert type="success" msg={success} />

                      <PrimaryBtn loading={loading} label="Send Reset Link" />
                    </form>

                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl
                      bg-slate-950/60 border border-slate-800 text-xs text-slate-500"
                    >
                      <BsShieldCheck
                        size={14}
                        className="text-indigo-400 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Link expires in{" "}
                        <span className="text-slate-400 font-medium">
                          15 minutes
                        </span>
                        . Check inbox and spam folder.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ── RESET PASSWORD ── */}
                {view === "reset" && (
                  <motion.div
                    key="reset"
                    variants={viewVar}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                        Set new password
                      </h2>
                      <p className="text-xs text-slate-500">
                        Choose a strong new password for your account.
                      </p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-4">
                      <div>
                        <Field
                          label="New Password"
                          icon={HiOutlineLockClosed}
                          value={resetForm.newPassword}
                          onChange={(e) =>
                            setReset((p) => ({
                              ...p,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Create strong password"
                          showToggle
                          show={show.np}
                          onToggle={() => toggle("np")}
                          autoComplete="new-password"
                        />
                        <StrengthChecker password={resetForm.newPassword} />
                      </div>

                      <Field
                        label="Confirm New Password"
                        icon={HiOutlineLockClosed}
                        value={resetForm.confirmNewPassword}
                        onChange={(e) =>
                          setReset((p) => ({
                            ...p,
                            confirmNewPassword: e.target.value,
                          }))
                        }
                        placeholder="Repeat new password"
                        showToggle
                        show={show.nc}
                        onToggle={() => toggle("nc")}
                        autoComplete="new-password"
                      />

                      <Alert type="error" msg={error} />
                      <Alert type="success" msg={success} />

                      <PrimaryBtn loading={loading} label="Reset Password" />
                    </form>

                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl
                      bg-slate-950/60 border border-slate-800 text-xs text-slate-500"
                    >
                      <BsShieldCheck
                        size={14}
                        className="text-indigo-400 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Cannot reuse your last{" "}
                        <span className="text-slate-400 font-medium">
                          3 passwords
                        </span>
                        .
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ══ OTP VIEW ══ */}
                {view === "otp" && (
                  <motion.div
                    key="otp"
                    variants={viewVar}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="text-center space-y-3">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20
          flex items-center justify-center mx-auto"
                      >
                        <HiOutlineMail size={28} className="text-indigo-400" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                          Check your Gmail
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          We sent a 6-digit OTP to
                          <br />
                          <span className="text-slate-300 font-medium">
                            {otpEmail}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 6 OTP Input Boxes */}
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, i) => (
                          <motion.input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onFocus={(e) => e.target.select()}
                            whileFocus={{ scale: 1.08 }}
                            className={`w-11 text-center text-xl font-bold text-white
                                        bg-slate-950/80 border rounded-xl outline-none
                                        transition-all duration-200
              ${
                digit
                  ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                  : "border-slate-700 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              }`}
                            style={{ height: "52px" }}
                          />
                        ))}
                      </div>

                      <Alert type="error" msg={error} />
                      <Alert type="success" msg={success} />

                      <PrimaryBtn loading={loading} label="Verify OTP" />
                    </form>

                    {/* Resend */}
                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <p className="text-xs text-slate-600">
                          Resend in{" "}
                          <span className="text-slate-400 font-medium">
                            {resendTimer}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendLoading}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 
                          flex items-center gap-1.5 mx-auto"
                        >
                          {resendLoading ? (
                            <>
                              <RiLoader4Line
                                size={12}
                                className="animate-spin"
                              />{" "}
                              Sending...
                            </>
                          ) : (
                            "Didn't receive it? Resend OTP"
                          )}
                        </button>
                      )}
                    </div>

                    {/* Wrong email */}
                    <button
                      type="button"
                      onClick={() => switchView("register")}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors mx-auto"
                    >
                      <IoArrowBack size={12} /> Wrong email? Go back
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
