import React, { useEffect } from "react";
import {
  TbX,
  TbAlertTriangle,
  TbInfoCircle,
  TbCircleCheck,
} from "react-icons/tb";

export default function PaymentStatusBanner({ status, onClose }) {
  const { type, message } = status || {};

  useEffect(() => {
    if (type && type !== "error") {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type || !message) return null;

  const bgClass =
    type === "error"
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-xl border p-3 flex items-center justify-between shadow-lg backdrop-blur-xl ${bgClass}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold">
        {type === "error" ? (
          <TbAlertTriangle size={16} />
        ) : (
          <TbInfoCircle size={16} />
        )}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-300 p-1"
      >
        <TbX size={14} />
      </button>
    </div>
  );
}
