// src/services/payment.service.js
// Handles all frontend → backend payment API calls directly using global Axios configuration.

import axios from "axios"; // 🚀 FIXED: Imported standard axios instead of non-existent api.js

// ─── Typed error for payment failures ────────────────────────────────────────
export class PaymentError extends Error {
    constructor(message, code, raw) {
        super(message);
        this.name = "PaymentError";
        this.code = code || "UNKNOWN";
        this.raw = raw || null;
    }
}

// ─── Error normaliser ─────────────────────────────────────────────────────────
function normalise(err, fallbackMessage) {
    if (err?.response) {
        const { status, data } = err.response;
        const message = data?.message || fallbackMessage;
        const code =
            status === 400 ? "BAD_REQUEST"
                : status === 401 ? "UNAUTHORIZED"
                    : status === 404 ? "NOT_FOUND"
                        : status === 429 ? "RATE_LIMITED"
                            : status >= 500 ? "SERVER_ERROR"
                                : "REQUEST_FAILED";
        return new PaymentError(message, code, err.response);
    }

    if (err?.request) {
        return new PaymentError(
            "Network error. Please check your connection and try again.",
            "NETWORK_ERROR",
            err
        );
    }

    if (err instanceof PaymentError) return err;

    return new PaymentError(fallbackMessage || err?.message || "Unexpected error", "UNKNOWN", err);
}

// ─── createOrder ──────────────────────────────────────────────────────────────
// POST /api/v1/payment/order
export async function createOrder(plan) {
    if (!plan?.id || !plan?.inr || !plan?.credits) { // 🚀 FIXED: plan.amount changed to plan.inr to match landing page data
        throw new PaymentError("Invalid plan details provided.", "BAD_REQUEST");
    }

    try {
        // 🚀 FIXED: Route changed to match your backend global proxy or router path (/api/v1/payment)
        const { data } = await axios.post("/api/v1/payment/order", {
            planId: plan.id,
            amount: plan.inr, // Mapped to match pricing array
            credit: plan.credits,
        });

        const order = data?.data;

        if (!order?.id) {
            throw new PaymentError("Server returned an invalid order. Please try again.", "SERVER_ERROR");
        }

        return order; // { id, amount, currency, receipt }
    } catch (err) {
        throw normalise(err, "Could not create payment order. Please try again.");
    }
}

// ─── verifyPayment ────────────────────────────────────────────────────────────
// POST /api/v1/payment/verify
export async function verifyPayment({ razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        throw new PaymentError("Incomplete payment details. Cannot verify.", "BAD_REQUEST");
    }

    try {
        // 🚀 FIXED: Route changed to /api/v1/payment/verify
        const { data } = await axios.post("/api/v1/payment/verify", {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        });

        return data; // Returns the result object to update state or context layers
    } catch (err) {
        if (err?.response?.status === 400) {
            throw new PaymentError(
                "Payment verification failed. If you were charged, please contact support.",
                "SIGNATURE_MISMATCH",
                err.response
            );
        }
        throw normalise(err, "Payment verification failed. Please contact support.");
    }
}

// ─── reportFailed ─────────────────────────────────────────────────────────────
// POST /api/v1/payment/failed
export async function reportFailed(razorpayOrderId, reason = "unknown") {
    if (!razorpayOrderId) return;

    try {
        // 🚀 FIXED: Route changed to /api/v1/payment/failed
        await axios.post("/api/v1/payment/failed", {
            razorpayOrderId,
            reason,
        });
    } catch {
        // Silently swallows failure metrics to prevent interface lockups
    }
}

// ─── getPaymentHistory ────────────────────────────────────────────────────────
// GET /api/v1/payment/history
export async function getPaymentHistory() {
    try {
        // 🚀 FIXED: Route changed to /api/v1/payment/history
        const { data } = await axios.get("/api/v1/payment/history");
        return data?.data ?? [];
    } catch (err) {
        throw normalise(err, "Could not load payment history.");
    }
}