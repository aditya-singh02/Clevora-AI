// hooks/useIntegrity.js
// Tracks integrity violations during an interview session.
// Call startTracking() when interview begins, stopTracking() when it ends.
// getReport() returns the final integrityReport object to send to the backend.
//
// Tracks: tab switch, paste, right click, keyboard shortcuts (Ctrl+C/V/U + F12)
// Shows a warning toast on every violation so the user knows they're being watched.

import { useState, useRef, useCallback, useEffect } from "react";

// ─── Deduction per violation type ────────────────────────────────────────────
const DEDUCTIONS = {
    tab_switch: 10,
    paste: 8,
    right_click: 2,
    keyboard_shortcut: 5,
};

const MAX_DEDUCTIONS = {
    tab_switch: 40, // max 4 hits
    paste: 32, // max 4 hits
    right_click: 8,  // max 4 hits
    keyboard_shortcut: 20, // max 4 hits
};

// Blocked keyboard combos
const BLOCKED_KEYS = [
    { ctrl: true, key: "c" }, // copy
    { ctrl: true, key: "v" }, // paste (caught by paste event too)
    { ctrl: true, key: "u" }, // view source
    { ctrl: true, key: "a" }, // select all
    { ctrl: true, key: "s" }, // save
    { key: "F12" }, // devtools
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useIntegrity({ onViolation } = {}) {
    // violations state — shown in real-time warning UI if needed
    const [violations, setViolations] = useState([]);
    const [totalViolations, setTotalViolations] = useState(0);
    const [integrityScore, setIntegrityScore] = useState(100);
    const [isTracking, setIsTracking] = useState(false);

    // Refs hold mutable state that event listeners can always read fresh
    const violationsRef = useRef([]);       // { type, count, timestamps }[]
    const totalRef = useRef(0);
    const scoreRef = useRef(100);
    const isTrackingRef = useRef(false);
    const deductedSoFarRef = useRef({          // track per-type totals to cap
        tab_switch: 0, paste: 0, right_click: 0, keyboard_shortcut: 0,
    });

    // ── Core recorder ─────────────────────────────────────────────────────────
    const recordViolation = useCallback((type) => {
        if (!isTrackingRef.current) return;

        const now = new Date();
        const deduction = DEDUCTIONS[type] || 0;
        const maxDed = MAX_DEDUCTIONS[type] || 0;
        const alreadyDeducted = deductedSoFarRef.current[type] || 0;

        // Only deduct if under the cap for this type
        const actualDeduction =
            alreadyDeducted < maxDed
                ? Math.min(deduction, maxDed - alreadyDeducted)
                : 0;

        deductedSoFarRef.current[type] = alreadyDeducted + actualDeduction;

        // Update violations array
        const existing = violationsRef.current.find((v) => v.type === type);
        if (existing) {
            existing.count += 1;
            existing.timestamps.push(now);
        } else {
            violationsRef.current.push({ type, count: 1, timestamps: [now] });
        }

        totalRef.current += 1;
        scoreRef.current = Math.max(0, scoreRef.current - actualDeduction);

        // Sync to state for reactive UI
        setViolations([...violationsRef.current]);
        setTotalViolations(totalRef.current);
        setIntegrityScore(scoreRef.current);

        // Notify parent (for toast/warning UI)
        onViolation?.({ type, score: scoreRef.current, total: totalRef.current });
    }, [onViolation]);

    // ── Event handlers ─────────────────────────────────────────────────────────

    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) recordViolation("tab_switch");
    }, [recordViolation]);

    const handleWindowBlur = useCallback(() => {
        // Fires when user alt-tabs to another app
        // Guard: don't double-count if visibilitychange already fired
        if (!document.hidden) recordViolation("tab_switch");
    }, [recordViolation]);

    const handlePaste = useCallback((e) => {
        // Only track paste in the document — not if user pastes into browser address bar
            console.log("🚨 PASTE CAUGHT"); // ADD THIS
            e.preventDefault();
            e.stopPropagation();
            recordViolation("paste");
        
    }, [recordViolation]);

    const handleContextMenu = useCallback((e) => {
        e.preventDefault(); // block the menu
        recordViolation("right_click");
    }, [recordViolation]);

    const handleKeyDown = useCallback((e) => {
        const matched = BLOCKED_KEYS.some((combo) => {
            const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
            const keyMatch = combo.key
                ? e.key.toLowerCase() === combo.key.toLowerCase()
                : true;
            return ctrlMatch && keyMatch && (combo.ctrl || combo.key === e.key);
        });

        if (matched) {
            e.preventDefault();
            recordViolation("keyboard_shortcut");
        }
    }, [recordViolation]);

    // ── Start / stop tracking ──────────────────────────────────────────────────
    const startTracking = useCallback(() => {
        console.log("🟢 startTracking called"); // ADD THIS
        if (isTrackingRef.current) return; // already tracking

        isTrackingRef.current = true;
        setIsTracking(true);

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);
        document.addEventListener("paste", handlePaste);
        console.log("✅ paste listener registered"); // ADD THIS

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
    }, [handleVisibilityChange, handleWindowBlur, handlePaste, handleContextMenu, handleKeyDown]);

    const stopTracking = useCallback(() => {
        if (!isTrackingRef.current) return;

        isTrackingRef.current = false;
        setIsTracking(false);

        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleWindowBlur);
        document.removeEventListener("paste", handlePaste);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
    }, [handleVisibilityChange, handleWindowBlur, handlePaste, handleContextMenu, handleKeyDown]);

    // ── Auto cleanup on unmount ────────────────────────────────────────────────
    useEffect(() => {
        return () => stopTracking();
    }, [stopTracking]);

    // ── Final report builder ───────────────────────────────────────────────────
    // Call this just before sending endInterview to backend.
    // Returns the integrityReport object matching your mongoose schema exactly.
    const getReport = useCallback(() => ({
        score: scoreRef.current,
        totalViolations: totalRef.current,
        violations: violationsRef.current.map((v) => ({
            type: v.type,
            count: v.count,
            timestamps: v.timestamps,
        })),
    }), []);

    // ── Reset (if user retakes) ────────────────────────────────────────────────
    const reset = useCallback(() => {
        violationsRef.current = [];
        totalRef.current = 0;
        scoreRef.current = 100;
        deductedSoFarRef.current = { tab_switch: 0, paste: 0, right_click: 0, keyboard_shortcut: 0 };
        setViolations([]);
        setTotalViolations(0);
        setIntegrityScore(100);
    }, []);

    return {
        // State (reactive — use in UI)
        integrityScore,    // 0–100, deducted per violation
        totalViolations,   // total count across all types
        violations,        // array of { type, count, timestamps }
        isTracking,        // bool

        // Controls
        startTracking,     // call when interview page mounts / question 1 starts
        stopTracking,      // call when interview ends (before endInterview API call)
        getReport,         // call to get the object to send to backend
        reset,             // call if user starts a fresh session
    };
}