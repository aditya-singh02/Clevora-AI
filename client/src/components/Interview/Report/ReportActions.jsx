// src/components/Interview/Report/ReportActions.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePdfReport } from "../../../data/generatePdfReport.js"; // 🚀 Clean dynamic hook file import

const TEXT_MUTE = "#6B7280";
const PRIMARY = "#6C63FF";

function ActionButton({
  icon,
  label,
  sublabel,
  onClick,
  variant = "default",
  disabled = false,
}) {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary: {
      bg: hovered ? "#5a52e0" : PRIMARY,
      border: PRIMARY,
      color: "#fff",
    },
    ghost: {
      bg: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      border: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
      color: hovered ? "#F9FAFB" : "#D1D5DB",
    },
  };
  const style = variants[variant] || variants.ghost;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "18px 16px",
        borderRadius: 14,
        background: disabled ? "rgba(255,255,255,0.03)" : style.bg,
        border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : style.border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all .2s",
        color: disabled ? TEXT_MUTE : style.color,
        flex: 1,
        minWidth: 120,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        {sublabel && (
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
            {sublabel}
          </div>
        )}
      </div>
    </button>
  );
}

export default function ReportActions({ report, interviewId, loading, card }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      // 🚀 Single clean action trigger block
      generatePdfReport(report, interviewId);
    } catch (err) {
      console.error("PDF Downloader Encountered a fault node: ", err);
    } finally {
      setDownloading(false);
    }
  };

  const performanceObj = report?.performanceReport || report;
  const scores = performanceObj?.overallScores || report?.overallScores;
  const finalScoreVal = scores?.finalScore ?? report?.finalScore ?? 0;

  return (
    <div style={{ ...card }}>
      <h3
        style={{
          margin: "0 0 18px",
          fontSize: 14,
          fontWeight: 600,
          color: TEXT_MUTE,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>⚡</span> What's Next?
      </h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <ActionButton
          icon={downloading ? "⏳" : "📄"}
          label={downloading ? "Compiling Matrix..." : "Download Report PDF"}
          sublabel="Premium Engine Generation"
          onClick={handleDownload}
          disabled={loading || !report || downloading}
          variant="primary"
        />
        <ActionButton
          icon="🔄"
          label="Retake Interview"
          sublabel={
            report?.metaData?.role
              ? `Same role: ${report.metaData.role}`
              : "Same settings"
          }
          onClick={() => navigate("/interview/start")}
          variant="ghost"
          disabled={loading}
        />
        <ActionButton
          icon="🏠"
          label="Dashboard"
          sublabel="View all interviews"
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          disabled={loading}
        />
      </div>

      {!loading && finalScoreVal !== undefined && (
        <div
          style={{
            marginTop: 20,
            padding: "14px 18px",
            borderRadius: 12,
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(34,197,94,0.06) 100%)",
            border: "1px solid rgba(108,99,255,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 24 }}>
            {parseFloat(finalScoreVal) >= 7
              ? "🎉"
              : parseFloat(finalScoreVal) >= 4
                ? "💪"
                : "📚"}
          </span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#E5E7EB",
                marginBottom: 2,
              }}
            >
              {parseFloat(finalScoreVal) >= 7
                ? "Excellent performance! You're interview-ready."
                : parseFloat(finalScoreVal) >= 4
                  ? "Good effort. A few more practice sessions will make a big difference."
                  : "Keep practicing. Every interview makes you stronger."}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTE }}>
              Practice consistently with Clevora to ace your placements.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
