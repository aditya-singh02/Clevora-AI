import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

// Custom tooltip remains identical...
function CustomTooltip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl border text-xs font-mono"
      style={{
        background: dark ? "rgba(8,12,24,0.95)" : "rgba(255,255,255,0.97)",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      <p className={`font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-slate-400">{p.name}:</span>
          <span
            className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart({ questions = [] }) {
  const { dark } = useTheme();

  // Parse strings to numbers if they are passed as strings from API
  const data = (questions || []).map((q, i) => ({
    name: `Q${i + 1}`,
    Score: Number(q.score) || 0,
    Confidence: Number(q.confidence) || 0,
    Communication: Number(q.communication) || 0,
    Correctness: Number(q.correctness) || 0,
  }));

  const lines = [
    { key: "Score", color: "#6366f1" },
    { key: "Confidence", color: "#8b5cf6" },
    { key: "Communication", color: "#06b6d4" },
    { key: "Correctness", color: "#10b981" },
  ];

  const gridColor = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const axisColor = dark ? "#475569" : "#94a3b8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      // 🚀 Added explicit layout bounds 'w-full overflow-hidden'
      className={`p-6 rounded-2xl border w-full overflow-hidden ${
        dark
          ? "bg-white/[0.025] border-white/[0.07]"
          : "bg-white border-slate-200"
      }`}
    >
      <h3
        className={`text-sm font-bold mb-5 ${dark ? "text-white" : "text-slate-900"}`}
      >
        Score Trend — Question by Question
      </h3>

      {/* 🚀 FIXED DETACHED HEIGHT HOISTING WRAPPER */}
      <div className="w-full h-[240px] relative">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                {lines.map((l) => (
                  <linearGradient
                    key={l.key}
                    id={`grad_${l.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={l.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={l.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                formatter={(val) => (
                  <span style={{ color: dark ? "#94a3b8" : "#64748b" }}>
                    {val}
                  </span>
                )}
              />

              {lines.map((l) => (
                <Area
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  stroke={l.color}
                  strokeWidth={2}
                  dot={{ fill: l.color, r: 4, strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: dark ? "#030712" : "#fff",
                  }}
                  fill={`url(#grad_${l.key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-500">
            No query script evaluation data captured.
          </div>
        )}
      </div>
    </motion.div>
  );
}
