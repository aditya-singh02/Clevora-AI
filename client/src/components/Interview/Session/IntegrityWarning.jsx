// Shows a dismissible warning toast at the top of the screen every time a violation is recorded during the interview.
import React, { useEffect } from "react";
import {
  BsShieldExclamation,
  BsEyeSlash,
  BsClipboard,
  BsMouseFill,
  BsKeyboard,
  BsX,
} from "react-icons/bs";

const META = {
  tab_switch: { Icon: BsEyeSlash, text: "Tab switch detected", deduction: 10 },
  paste: { Icon: BsClipboard, text: "Paste attempt recorded", deduction: 8 },
  right_click: { Icon: BsMouseFill, text: "Right click blocked", deduction: 2 },
  keyboard_shortcut: {
    Icon: BsKeyboard,
    text: "Blocked shortcut detected",
    deduction: 5,
  },
};

export default function IntegrityWarning({ warning, onDismiss }) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!warning) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [warning, onDismiss]);

  if (!warning) return null;

  const meta = META[warning.type] || {
    Icon: BsShieldExclamation,
    text: "Violation detected",
    deduction: 0,
  };

  const { Icon, text, deduction } = meta;

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3 bg-[#1a0a0a] border border-rose-500/30 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {/* Icon */}
        <div className="w-7 h-7 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-rose-400" />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-rose-300 leading-tight">
            ⚠️ {text}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            −{deduction} integrity points · Score: {warning.score}/100
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="ml-2 text-slate-600 hover:text-slate-400 transition-colors shrink-0"
          aria-label="Dismiss warning"
        >
          <BsX size={18} />
        </button>
      </div>
    </div>
  );
}
