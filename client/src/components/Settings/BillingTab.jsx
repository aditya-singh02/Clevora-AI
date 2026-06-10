import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";
import { BsCreditCard2BackFill, BsClockHistory } from "react-icons/bs";

export default function BillingTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [totalInterviews, setTotalInterviews] = useState(0); // 🚀 Real DB Count State

  // 📡 1. Load wallet credit balance directly out of Redux
  const user = useSelector((state) => state.user);
  const currentCredits = user?.userData?.credits ?? 0;

  const serverUrl = import.meta.env.VITE_SERVER_URL || "";

  // 📡 2. PARALLEL SYNC: Fetch statement list AND actual attempted interviews count
  useEffect(() => {
    let isMounted = true;

    const fetchBillingAndMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust endpoints paths based on your actual routes configuration
        const [historyRes, interviewRes] = await Promise.all([
          axios.get(`${serverUrl}/api/v1/payment/history`, {
            withCredentials: true,
          }),
          axios.get(`${serverUrl}/api/v1/interview/get-my-interviews`, {
            withCredentials: true,
          }), // Hits getMyInterviews controller
        ]);

        if (!isMounted) return;

        // Sync Purchase History Logs
        if (historyRes.data?.success && Array.isArray(historyRes.data.data)) {
          setPurchaseHistory(historyRes.data.data);
        }

        // Sync Real Attempted Interviews Length
        if (
          interviewRes.data?.success &&
          Array.isArray(interviewRes.data.data)
        ) {
          setTotalInterviews(interviewRes.data.data.length);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Metrics alignment breakdown: ", err);
          setError(
            "Could not safely sync your statement histories or interview metrics.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBillingAndMetrics();
    return () => {
      isMounted = false;
    };
  }, [serverUrl]);

  if (loading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center gap-2 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
        <div className="h-4 w-4 rounded-full border border-white/20 border-t-[#6C63FF] animate-spin" />
        Syncing stats...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-[11px] font-mono text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Grid Match Wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Account Balance
            </p>
            <p className="text-xl font-bold text-[#6C63FF] mt-1">
              {currentCredits} Credits
            </p>
            
          </div>
          <div className="p-2.5 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
            <BsCreditCard2BackFill size={16} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Total Usage
            </p>
            <p className="text-xl font-bold text-slate-200 mt-1">
              {totalInterviews * 20} Spent
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Tokens Spent Across {totalInterviews} Interviews
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] text-slate-500">
            <BsClockHistory size={16} />
          </div>
        </div>
      </div>

      {/* History Ledger Layout */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Purchase History
        </h4>
        <div className="w-full overflow-x-auto border border-white/[0.05] rounded-xl bg-white/[0.005]">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3">Date</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-center">Tokens</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 divide-y divide-white/[0.02]">
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((item, idx) => {
                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Just Now";
                  let planName =
                    item.planId === "expert" ||
                    item.credit === 1200 ||
                    item.amount === 349
                      ? "Expert Plan"
                      : "Pro Plan";

                  return (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {formattedDate}
                      </td>
                      <td className="p-3 font-semibold text-slate-200">
                        {planName}
                      </td>
                      <td className="p-3 text-slate-400">
                        ₹{item.amount || 0}
                      </td>
                      <td className="p-3 text-center text-[#6C63FF] font-bold">
                        {item.credit || 0} Credits
                      </td>
                      <td
                        className={`p-3 text-right text-[11px] font-semibold ${item.status === "paid" ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {item.status === "paid"
                          ? "Success"
                          : item.status?.toUpperCase() || "PENDING"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-500 font-mono text-[11px] uppercase tracking-widest"
                  >
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}