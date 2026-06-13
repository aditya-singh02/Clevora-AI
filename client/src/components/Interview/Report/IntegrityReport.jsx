import React from "react";
import {
  BsShieldCheck,
  BsShieldExclamation,
  BsShieldX,
  BsEyeSlash,
  BsClipboard,
  BsMouseFill,
  BsKeyboard,
} from "react-icons/bs";

const VIOLATION_META = {
  tab_switch: {
    label: "Tab or Window Switch",
    sub: "You left the interview screen.",
    Icon: BsEyeSlash,
    deduction: 10,
  },
  paste: {
    label: "Paste Action Caught",
    sub: "Pasted text inside answer area.",
    Icon: BsClipboard,
    deduction: 8,
  },
  right_click: {
    label: "Right Click Blocked",
    sub: "Tried to open mouse context menu.",
    Icon: BsMouseFill,
    deduction: 2,
  },
  keyboard_shortcut: {
    label: "Blocked Shortcut Tried",
    sub: "Used copy, paste, or developer tool keys.",
    Icon: BsKeyboard,
    deduction: 5,
  },
};

function getTier(score) {
  if (score >= 90)
    return {
      label: "Excellent",
      sub: "No security issues detected. Clean session!",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
      ringColor: "#34d399",
      Icon: BsShieldCheck,
    };
  if (score >= 65)
    return {
      label: "Fair Progress",
      sub: "Minor alerts recorded. Try to stay focused.",
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
      ringColor: "#fbbf24",
      Icon: BsShieldExclamation,
    };
  return {
    label: "High Risk Alert",
    sub: "Multiple violations caught. Integrity is compromised.",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
    ringColor: "#f87171",
    Icon: BsShieldX,
  };
}

function ScoreRing({ score, color }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="#ffffff08"
        strokeWidth="5"
      />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x="40"
        y="42"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="14"
        fontWeight="800"
      >
        {score}%
      </text>
    </svg>
  );
}

function ViolationRow({ violation }) {
  const meta = VIOLATION_META[violation.type];
  if (!meta) return null;
  const { Icon, label, sub, deduction } = meta;

  const totalDeducted = Math.min(violation.count * deduction, deduction * 4);

  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/[0.03] last:border-0 w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-rose-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-200 leading-tight">
            {label}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right">
          <p className="text-xs font-black text-rose-400">{violation.count}×</p>
          <p className="text-[9px] text-slate-600 uppercase tracking-wide">
            Count
          </p>
        </div>
        <div className="text-right w-16">
          <p className="text-xs font-black text-rose-500">
            -{totalDeducted} pts
          </p>
          <p className="text-[9px] text-slate-600 uppercase tracking-wide">
            Penalty
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IntegrityReport({ integrityReport }) {
  const report = integrityReport ?? {
    score: 100,
    totalViolations: 0,
    violations: [],
  };

  console.log("🔍 Integrity Report Data:", report); // Debug log to inspect report structure and values
  const { score, totalViolations, violations } = report;

  const tier = getTier(score);
  const TierIcon = tier.Icon;
  const activeViolations = violations.filter((v) => v.count > 0);

  return (
    <div className="w-full space-y-3">
      <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-500 block">
        Security Integrity Report
      </p>

      <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 border-b border-white/[0.04]">
          <ScoreRing score={score} color={tier.ringColor} />

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <TierIcon size={15} className={tier.color} />
              <h3 className={`text-sm font-black tracking-tight ${tier.color}`}>
                {tier.label} Status
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {tier.sub}
            </p>
          </div>

          <div
            className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border shrink-0 ${tier.bg}`}
          >
            <p className={`text-xl font-black font-mono ${tier.color}`}>
              {totalViolations}
            </p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Total Alerts
            </p>
          </div>
        </div>

        <div className="px-5 py-1">
          {activeViolations.length === 0 ? (
            <div className="flex items-center gap-2.5 py-6 text-left">
              <BsShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <p className="text-xs font-medium text-slate-400">
                Excellent! No security violations were recorded during your
                interview session.
              </p>
            </div>
          ) : (
            activeViolations.map((v) => (
              <ViolationRow key={v.type} violation={v} />
            ))
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-white/[0.03] bg-white/[0.005]">
          <p className="text-[10px] text-slate-500 leading-relaxed text-left">
            <span className="text-slate-400 font-bold">Rules: </span>
            Score starts at 100. Screen updates deduct points: Tab Switch (-10),
            Paste Attempts (-8), Keyboard Shortcuts (-5), and Right Click (-2).
            Caps apply per alert type.
          </p>
        </div>
      </div>
    </div>
  );
}
