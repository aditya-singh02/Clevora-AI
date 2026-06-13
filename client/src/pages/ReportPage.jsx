import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Core Performance Analytics Subcomponents
import ReportTopBar from "../components/Interview/Report/ReportTopBar.jsx";
import ScoreHero from "../components/Interview/Report/ScoreHero.jsx";
import PerformanceChart from "../components/Interview/Report/PerformanceChart.jsx";
import IntegrityReport from "../components/Interview/Report/IntegrityReport.jsx";
import QuestionBreakdown from "../components/Interview/Report/QuestionBreakdown.jsx";
import StrengthsWeaknesses from "../components/Interview/Report/StrengthsWeaknesses.jsx";
import ReportActions from "../components/Interview/Report/ReportActions.jsx";

// Smooth UI Wrapper Components
import FadeIn from "../components/ui/FadeIn.jsx";
import { NeuralBg } from "../components/ui/NeuralBg.jsx";
import { useCursorGlow } from "../hooks/useCursorGlow.js";

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Route state parameter caching setup
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);

  const glowData = useCursorGlow() || {};
  const { x, y, ...cursorHandlers } = glowData;

  console.log("report:", report); // Debug log to verify report data structure
  useEffect(() => {
    if (location.state?.report) {
      setReport(location.state.report);
      setLoading(false);
      return;
    }

    const fetchReportMetrics = async () => {
      try {
        setLoading(true);
        const serverUrl = import.meta.env.VITE_SERVER_URL || "";

        const response = await axios.get(
          `${serverUrl}/api/v1/interview/report/${id}`,
          { withCredentials: true },
        );

        // 🚀 Matches your standard custom response structure perfectly
        if (response.data?.success && response.data.data) {
          setReport(response.data.data);
        }
      } catch (err) {
        console.error("Failed loading interview report metrics data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReportMetrics();
  }, [id, location.state]);

  const handleDownloadPdfCall = () => {
    window.print();
  };

  // Easy English Loading screen
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center gap-4 text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        Loading your interview report...
      </div>
    );
  }

  // Easy English Error screen
  if (!report) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center text-xs font-mono text-slate-500 uppercase">
        Interview report not found or has expired.
      </div>
    );
  }

  // 🚀 CLEAN SEAMLESS DATA COUPLING FROM CONTROLLER STRUCTURE
  const meta = report.metaData || {};
  const scores = report.overallScores || {
    finalScore: report.finalScore || 0,
    confidence: report.confidence || 0,
    communication: report.communication || 0,
    correctness: report.correctness || 0,
  };

const questionsList =  report.questionWiseScore || [];
  return (
    <div
      {...cursorHandlers}
      className="dark min-h-screen w-full bg-[#030712] text-slate-200 py-12 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col select-none"
    >
      {/* INDIGO GLOW BACKGROUND ORB */}
      {x !== undefined && y !== undefined && (
        <div
          className="absolute pointer-events-none rounded-full opacity-15 blur-[150px] mix-blend-screen z-0 hidden sm:block"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: "650px",
            height: "650px",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* NEURAL BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <NeuralBg />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 space-y-6 my-auto">
        <FadeIn className="space-y-6">
          {/* Section 1: Top Metadata Info Bar */}
          <ReportTopBar
            role={meta.role || "Software Developer"}
            mode={meta.mode || "Technical"}
            date={
              meta.createdAt
                ? new Date(meta.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Just Now"
            }
            duration={
              meta.totalQuestions
                ? `${meta.totalAnswered || 0} / ${meta.totalQuestions} Answered`
                : "Completed"
            }
          />

          {/* Section 2: Overall Metrics Score Cards */}
          <ScoreHero overallScores={scores} />

          {/* Section 3: Charts & Integrity Split Block Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Chart Module Engine */}
            <PerformanceChart questions={questionsList} />

            {/* Integrity report component - uses unified backend response parameters */}
            <IntegrityReport
              integrityReport={
                report.integrityReport || {
                  score: report.integrityScore || 100,
                  totalViolations:
                    report.tabSwitchesCount +
                      report.copyCount +
                      report.pasteCount || 0,
                  violations: [], // Map your counts to the violation format here
                }
              }
            />
          </div>

          {/* Section 4: Accordion Questions Block List */}
          <QuestionBreakdown questions={questionsList} />

          {/* Section 5: Strengths & Weaknesses Dynamic Calculator Frame */}
          <StrengthsWeaknesses
            strengths={
              questionsList
                .filter((q) => (q.score ?? q.scores?.score ?? 0) >= 7)
                .map(
                  (q) =>
                    q.feedback ||
                    "Good implementation and technical communication.",
                ).length > 0
                ? questionsList
                    .filter((q) => (q.score ?? q.scores?.score ?? 0) >= 7)
                    .map(
                      (q) =>
                        q.feedback ||
                        "Good implementation and technical communication.",
                    )
                : ["Complete more questions to identify strengths."]
            }
            improvements={
              questionsList
                .filter((q) => (q.score ?? q.scores?.score ?? 0) < 7)
                .map(
                  (q) =>
                    q.feedback ||
                    "Needs clear technical detailing and deeper conceptual validation.",
                ).length > 0
                ? questionsList
                    .filter((q) => (q.score ?? q.scores?.score ?? 0) < 7)
                    .map(
                      (q) =>
                        q.feedback ||
                        "Needs clear technical detailing and deeper conceptual validation.",
                    )
                : ["No major weak areas detected. Great job!"]
            }
          />

          {/* Section 6: Action Overlay Button Controls Panel */}
          <ReportActions
            report={report}
            onDownloadPdf={handleDownloadPdfCall}
            onRetake={() => navigate("/interview-setup")} // 🚀 Kept standard seamless route target
          />
        </FadeIn>
      </div>
    </div>
  );
}
