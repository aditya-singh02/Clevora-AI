// src/utils/generatePdfReport.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdfReport = (report, id) => {
    if (!report) return;

    // ── Data Extraction (handles both API shape and location.state shape) ──
    const meta = report.metaData || {};
    const scores = report.overallScores || {};

    const finalScore     = parseFloat(scores.finalScore     ?? report.finalScore     ?? 0);
    const confidence     = parseFloat(scores.confidence     ?? report.confidence     ?? 0);
    const communication  = parseFloat(scores.communication  ?? report.communication  ?? 0);
    const correctness    = parseFloat(scores.correctness    ?? report.correctness    ?? 0);
    const problemSolving = parseFloat(((correctness * 0.6) + (confidence * 0.4)).toFixed(1));

    const questionsList  = report.questionWisePerformance || report.questionWiseScore || [];
    const integrity      = report.integrityReport || {};
    const integrityScore = integrity.score ?? 100;
    const totalViolations = integrity.totalViolations ?? 0;
    const violations     = integrity.violations || [];

    const roleName       = meta.role        || report.role        || "Software Engineer";
    const interviewMode  = meta.mode        || report.mode        || "Technical";
    const expLevel       = meta.experience  || report.experience  || "Not Specified";
    const totalQ         = meta.totalQuestions  || questionsList.length || 5;
    const totalAnswered  = meta.totalAnswered   || questionsList.filter(q => q.answer?.trim()).length || 0;
    const reportDate     = meta.createdAt
        ? new Date(meta.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    // ── Score tier label ──
    const getTier = (s) => {
        if (s >= 8)  return "Excellent";
        if (s >= 6)  return "Good";
        if (s >= 4)  return "Average";
        return "Needs Work";
    };

    // ── Integrity tier ──
    const getIntegrityTier = (s) => {
        if (s >= 90) return { label: "Excellent — Clean Session", color: [16, 185, 129] };
        if (s >= 65) return { label: "Fair — Minor Alerts Recorded", color: [251, 191, 36] };
        return       { label: "High Risk — Multiple Violations", color: [248, 113, 113] };
    };

    const VIOLATION_LABELS = {
        tab_switch:        "Tab / Window Switch",
        paste:             "Paste Attempt",
        right_click:       "Right Click",
        keyboard_shortcut: "Blocked Shortcut",
    };

    const VIOLATION_DEDUCTIONS = { tab_switch: 10, paste: 8, right_click: 2, keyboard_shortcut: 5 };

    // ── jsPDF Setup ──
    const doc  = new jsPDF("p", "mm", "a4");
    const pW   = doc.internal.pageSize.getWidth();
    const pH   = doc.internal.pageSize.getHeight();
    const mg   = 20;
    const cW   = pW - mg * 2;
    let   y    = 20;

    const INDIGO  = [79, 70, 229];
    const DARK    = [17, 24, 39];
    const GRAY    = [75, 85, 99];
    const LIGHT   = [249, 250, 251];
    const BORDER  = [229, 231, 235];

    const newPage = () => {
        doc.addPage();
        y = 20;
    };

    const checkPageBreak = (needed = 30) => {
        if (y + needed > pH - 20) newPage();
    };

    // ════════════════════════════════════════════
    // SECTION 1 — HEADER
    // ════════════════════════════════════════════
    doc.setFillColor(...INDIGO);
    doc.rect(0, 0, pW, 38, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Clevora AI — Interview Performance Report", pW / 2, 17, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(199, 210, 254);
    doc.text("Automated Assessment Engine • Confidential Candidate Report", pW / 2, 26, { align: "center" });

    y = 48;

    // ════════════════════════════════════════════
    // SECTION 2 — CANDIDATE META BOX
    // ════════════════════════════════════════════
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(mg, y, cW, 28, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text("Candidate Profile", mg + 8, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...GRAY);

    doc.text(`Target Role:`,     mg + 8,  y + 16);
    doc.text(`${roleName}`,      mg + 35, y + 16);
    doc.text(`Mode:`,            mg + 95, y + 16);
    doc.text(`${interviewMode}`, mg + 108, y + 16);

    doc.text(`Experience:`,      mg + 8,  y + 23);
    doc.text(`${expLevel}`,      mg + 35, y + 23);
    doc.text(`Date:`,            mg + 95, y + 23);
    doc.text(`${reportDate}`,    mg + 108, y + 23);

    y += 36;

    // ════════════════════════════════════════════
    // SECTION 3 — OVERALL SCORE HERO
    // ════════════════════════════════════════════
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("Overall Performance", mg, y);
    y += 6;

    // Final score big box
    doc.setFillColor(238, 242, 255);
    doc.setDrawColor(...INDIGO);
    doc.roundedRect(mg, y, cW, 18, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...INDIGO);
    doc.text(
        `Final Score: ${finalScore.toFixed(1)} / 10  —  ${getTier(finalScore)}`,
        pW / 2, y + 12, { align: "center" }
    );

    y += 26;

    // 4 sub-metric boxes in a row
    const boxW = (cW - 9) / 4;
    const metrics = [
        { label: "Confidence",    value: confidence },
        { label: "Communication", value: communication },
        { label: "Correctness",   value: correctness },
        { label: "Problem Solving", value: problemSolving },
    ];

    metrics.forEach((m, i) => {
        const bx = mg + i * (boxW + 3);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...BORDER);
        doc.roundedRect(bx, y, boxW, 22, 3, 3, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...INDIGO);
        doc.text(`${m.value.toFixed(1)}`, bx + boxW / 2, y + 12, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(m.label, bx + boxW / 2, y + 19, { align: "center" });
    });

    y += 32;

    // Questions answered pill
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(mg, y, cW, 10, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text(
        `Questions Answered: ${totalAnswered} / ${totalQ}`,
        pW / 2, y + 7, { align: "center" }
    );

    y += 18;

    // ════════════════════════════════════════════
    // SECTION 4 — INTEGRITY REPORT
    // ════════════════════════════════════════════
    checkPageBreak(50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("Security Integrity Report", mg, y);
    y += 6;

    const intTier = getIntegrityTier(integrityScore);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(mg, y, cW, 18, 3, 3, "FD");

    // Score circle area
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...intTier.color);
    doc.text(`${integrityScore}%`, mg + 14, y + 12, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(intTier.label, mg + 28, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.text(`Total Violations: ${totalViolations}`, mg + 28, y + 15);

    // violations count on right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...intTier.color);
    doc.text(`${totalViolations}`, mg + cW - 14, y + 12, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("Alerts", mg + cW - 14, y + 17, { align: "center" });

    y += 24;

    // Violation breakdown table if any
    if (violations.length > 0) {
        const activeV = violations.filter(v => v.count > 0);
        if (activeV.length > 0) {
            autoTable(doc, {
                startY: y,
                margin: { left: mg, right: mg },
                head: [["Violation Type", "Count", "Penalty Points"]],
                body: activeV.map(v => {
                    const ded = VIOLATION_DEDUCTIONS[v.type] || 0;
                    const total = Math.min(v.count * ded, ded * 4);
                    return [
                        VIOLATION_LABELS[v.type] || v.type,
                        `${v.count}×`,
                        `-${total} pts`,
                    ];
                }),
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: "bold" },
                columnStyles: {
                    0: { cellWidth: "auto" },
                    1: { cellWidth: 20, halign: "center" },
                    2: { cellWidth: 30, halign: "center", textColor: [239, 68, 68], fontStyle: "bold" },
                },
                alternateRowStyles: { fillColor: [255, 241, 242] },
            });
            y = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 10 : y + 30;
        }
    } else {
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(mg, y, cW, 10, 2, 2, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(6, 95, 70);
        doc.text("✓ No security violations recorded. Clean session.", pW / 2, y + 7, { align: "center" });
        y += 18;
    }

    // ════════════════════════════════════════════
    // SECTION 5 — STRENGTHS & IMPROVEMENTS
    // ════════════════════════════════════════════
    checkPageBreak(40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("Strengths & Areas for Improvement", mg, y);
    y += 6;

    const strengths    = questionsList.filter(q => (q.score ?? q.scores?.score ?? 0) >= 7).map(q => q.feedback).filter(Boolean);
    const improvements = questionsList.filter(q => (q.score ?? q.scores?.score ?? 0) < 7).map(q => q.feedback).filter(Boolean);

    const halfW = (cW - 6) / 2;

    // Strengths box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(mg, y, halfW, 8, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 95, 70);
    doc.text("Key Strengths", mg + halfW / 2, y + 5.5, { align: "center" });

    // Improvements box
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(mg + halfW + 6, y, halfW, 8, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27);
    doc.text("Areas for Improvement", mg + halfW + 6 + halfW / 2, y + 5.5, { align: "center" });

    y += 12;

    const maxRows = Math.max(strengths.length, improvements.length, 1);
    const strList  = strengths.length    > 0 ? strengths    : ["No strong answers identified."];
    const impList  = improvements.length > 0 ? improvements : ["No weak areas detected. Great job!"];

    for (let i = 0; i < maxRows; i++) {
        const str = strList[i] || "";
        const imp = impList[i] || "";

        const strLines = str ? doc.splitTextToSize(`• ${str}`, halfW - 6) : [];
        const impLines = imp ? doc.splitTextToSize(`• ${imp}`, halfW - 6) : [];
        const rowH = Math.max(strLines.length, impLines.length) * 4.5 + 4;

        checkPageBreak(rowH + 4);

        if (strLines.length) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(6, 78, 59);
            doc.text(strLines, mg + 3, y + 4);
        }
        if (impLines.length) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(127, 29, 29);
            doc.text(impLines, mg + halfW + 9, y + 4);
        }

        y += rowH;
    }

    y += 6;

    // ════════════════════════════════════════════
    // SECTION 6 — QUESTION BREAKDOWN TABLE
    // ════════════════════════════════════════════
    checkPageBreak(20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("Question-wise Response Breakdown", mg, y);
    y += 5;

    autoTable(doc, {
        startY: y,
        margin: { left: mg, right: mg },
        head: [["#", "Question & Answer", "Scores", "AI Feedback"]],
        body: questionsList.map((q, i) => {
            const sc = q.score ?? q.scores?.score ?? 0;
            const cf = q.confidence ?? q.scores?.confidence ?? 0;
            const cm = q.communication ?? q.scores?.communication ?? 0;
            const cr = q.correctness ?? q.scores?.correctness ?? 0;
            return [
                `${i + 1}\n${(q.difficulty || "").toUpperCase()}`,
                `Q: ${q.question || "—"}\n\nA: ${q.answer?.trim() || "No answer provided."}`,
                `Score: ${sc}/10\nConf:  ${cf}/10\nComm: ${cm}/10\nCorr:  ${cr}/10`,
                q.feedback || "No feedback recorded.",
            ];
        }),
        styles: {
            fontSize: 8.5,
            cellPadding: 5,
            valign: "top",
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: INDIGO,
            textColor: 255,
            fontStyle: "bold",
            fontSize: 9,
        },
        columnStyles: {
            0: { cellWidth: 16, halign: "center" },
            1: { cellWidth: 78 },
            2: { cellWidth: 28, fontStyle: "bold", textColor: INDIGO },
            3: { cellWidth: "auto" },
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        didParseCell(data) {
            // Highlight skipped answers
            if (data.column.index === 1 && data.cell.text.join("").includes("No answer provided")) {
                data.cell.styles.textColor = [156, 163, 175];
            }
        },
    });

    y = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 14 : y + 40;

    // ════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════
    const footerY = Math.min(y, pH - 14);
    doc.setDrawColor(...BORDER);
    doc.line(mg, footerY, pW - mg, footerY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    doc.text(
        "CLEVORA ASSESSMENT ENGINE  •  AI-POWERED INTERVIEW EVALUATION  •  CONFIDENTIAL",
        pW / 2, footerY + 6, { align: "center" }
    );

    doc.save(`Clevora_Report_${id || "Session"}.pdf`);
};