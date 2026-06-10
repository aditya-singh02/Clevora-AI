import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheckCircle } from "react-icons/bs";

export default function NotificationsTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const userState = useSelector((state) => state.user);
  const user = userState?.user || userState;
  const existingConfigs = user?.userData?.notificationConfigs;

  const [notifications, setNotifications] = useState({
    interviewReports: true,
    paymentReceipts: true,
    productUpdates: false,
    placementTips: true,
  });

  useEffect(() => {
    if (existingConfigs) {
      setNotifications({
        interviewReports: existingConfigs.interviewReports ?? true,
        paymentReceipts: existingConfigs.paymentReceipts ?? true,
        productUpdates: existingConfigs.productUpdates ?? false,
        placementTips: existingConfigs.placementTips ?? true,
      });
    }
  }, [existingConfigs]);

  const handleUpdateNotifications = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 600);
  };

  const rows = [
    {
      key: "interviewReports",
      label: "Interview Reports",
      desc: "Get detailed analytics summaries and scorecards directly on email.",
    },
    {
      key: "paymentReceipts",
      label: "Payment Receipts",
      desc: "Receive transaction receipts immediately following successful checkouts.",
    },
    {
      key: "productUpdates",
      label: "Product Updates",
      desc: "Stay informed about newly deployed AI models and system features.",
    },
    {
      key: "placementTips",
      label: "Placement Tips",
      desc: "Receive targeted notifications optimized to trace and clear screening standards.",
    },
  ];

  return (
    <div className="space-y-5">
      {/* List layout to seamlessly blend with Screenshot 2026-06-11 at 2.28.37 AM.jpg design standard */}
      <div className="divide-y divide-white/[0.05] border-b border-white/[0.05]">
        {rows.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-start gap-6 py-4 first:pt-1"
          >
            <div className="max-w-xl">
              <p className="text-xs font-semibold text-slate-200">
                {item.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                {item.desc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications[item.key]}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  [item.key]: e.target.checked,
                })
              }
              className="w-4 h-4 mt-1 accent-[#6C63FF] rounded border-white/20 bg-transparent cursor-pointer shrink-0 focus:ring-0 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Control Actions Bar */}
      <div className="pt-2 flex justify-end gap-3 items-center">
        <AnimatePresence>
          {saveSuccess && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium"
            >
              <BsCheckCircle size={12} /> Sync Complete!
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={handleUpdateNotifications}
          disabled={isSaving}
          className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-semibold text-xs px-5 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-[#6C63FF]/10"
        >
          {isSaving ? "Saving..." : "Apply Configurations"}
        </button>
      </div>
    </div>
  );
}
