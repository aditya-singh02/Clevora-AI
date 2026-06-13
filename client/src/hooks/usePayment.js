import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createOrder, verifyPayment, reportFailed } from "../services/payment.service.js";

import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js"; // OPTIONAL: If you want to update user credits in real-time after purchase, you can dispatch setUserData here with the new credits from the verifyPayment response

export function usePayment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //  Redux state check to match your persisted storage keys
    const userState = useSelector((state) => state.user);
    const user = userState?.user || userState;

    // ── States ────
    const [isLoading, setIsLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(null);
    const [overlayMsg, setOverlayMsg] = useState("");
    const [status, setStatus] = useState({ type: null, message: null });

    const rzpRef = useRef(null);

    const showError = (msg) => setStatus({ type: "error", message: msg });
    const showSuccess = (msg) => setStatus({ type: "success", message: msg });
    const showInfo = (msg) => setStatus({ type: "info", message: msg });
    const clearStatus = () => setStatus({ type: null, message: null });

    const resetLoadingState = useCallback(() => {
        setIsLoading(false);
        setActivePlan(null);
        setOverlayMsg("");
        rzpRef.current = null;
    }, []);

    // ── Main handler ──────
    const handleBuy = useCallback(
        async (plan, sdkReady) => {
            if (isLoading) return;

            // Checking if script injection is 100% evaluated
            if (!sdkReady || !window.Razorpay) {
                showError("Payment system is not fully loaded yet. Please try again in a moment.");
                return;
            }

            clearStatus();
            setIsLoading(true);
            setActivePlan(plan);
            setOverlayMsg("Creating your order…");

            let order = null;

            try {
                // Step 1: Hit service to register transaction parameters
                order = await createOrder(plan);
            } catch (err) {
                resetLoadingState();
                if (err.code === "RATE_LIMITED") {
                    showError("Too many payment attempts. Please wait 15 minutes.");
                } else if (err.code === "UNAUTHORIZED") {
                    showError("Session expired. Please log in again.");
                    navigate("/login");
                } else {
                    showError(err.message || "Could not create order. You were not charged.");
                }
                return;
            }

            setOverlayMsg("Opening payment window…");

            // Step 2: Configure Razorpay native overlay options sheet
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency || "INR",
                order_id: order.id,
                name: import.meta.env.VITE_APP_NAME || "Clevora AI",
                description: `${plan.credits} credits — ${plan.name} plan`,
                prefill: {
                    name: user?.name || "Candidate",
                    email: user?.email || "",
                    contact: user?.phoneNumber || user?.contact || "",
                },
                theme: { color: "#6366f1" },
                retry: { enabled: false },

                modal: {
                    escape: true,
                    backdropclose: false,
                    confirm_close: true,

                    ondismiss: async () => {
                        await reportFailed(order.id, "user_dismissed");
                        resetLoadingState();
                        showInfo("Payment cancelled. You were not charged.");
                    },
                },

                // Success Handshake handler
                handler: async (response) => {
                    setOverlayMsg("Verifying payment…");
                    try {
                        const result = await verifyPayment({
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        console.log("✅ Payment verification result:", result);

                        const updatedUser = result?.data?.user;

                        if (updatedUser) {
                            console.log("🔥 Updating Redux with:", updatedUser.credits);
                            dispatch(setUserData(updatedUser));
                        }

                        setOverlayMsg("Receipt generating... Redirecting securely...");

                        navigate("/payment/success", {
                            state: {
                                plan,
                                newCredits: updatedUser.credits,
                                paymentId: response.razorpay_payment_id,
                            },
                        });
                        setOverlayMsg("Payment verified. Generating receipt...");
                        resetLoadingState();
                    } catch (err) {
                        resetLoadingState();
                        if (err.code === "SIGNATURE_MISMATCH") {
                            showError("Payment received but verification failed. Please contact support.");
                        } else {
                            showError(err.message || "Verification failed. Please check with your bank.");
                        }
                    }
                },
            };

            let rzp;
            try {
                rzp = new window.Razorpay(options);
                rzpRef.current = rzp;
            } catch (err) {
                resetLoadingState();
                showError("Could not open payment window. Please try again.");
                return;
            }

            // Bank Declined / Failure event listener tracking
            rzp.on("payment.failed", async (response) => {
                await reportFailed(order.id, `${response.error?.code}:${response.error?.reason}`);
                resetLoadingState();

                //  REDIRECT TO FAILURE PAGE WITH STATE LOGS
                navigate("/payment/failure", {
                    state: {
                        plan,
                        errorMsg: response.error?.description || "Payment failed at bank gateway tier.",
                        orderId: order.id
                    }
                });
            });

            rzp.open();
            setOverlayMsg("");
        },
        [isLoading, user, navigate, resetLoadingState]
    );

    return {
        handleBuy,
        isLoading,
        activePlan,
        overlayMsg,
        status,
        clearStatus,
    };
}

// ─── Error message builder ────────────────────────────────────────────────────
function buildUserFacingError(code, reason, description, step) {
    const reasonMap = {
        payment_cancelled: "Payment was cancelled. You were not charged.",
        payment_timeout: "Payment timed out. Please try again.",
        insufficient_funds: "Insufficient funds. Please try another payment method.",
        card_limit_exceeded: "Your card limit was exceeded. Try a different card or UPI.",
        invalid_card: "Your card details appear to be invalid. Please check and retry.",
        bank_not_enabled_for_net_banking: "Your bank is not enabled for this payment. Try another method.",
        upi_payment_cancelled: "UPI payment was cancelled. Please try again.",
        user_cancelled: "Payment cancelled. You were not charged.",
    };

    if (reasonMap[reason]) return reasonMap[reason];

    const codeMap = {
        BAD_REQUEST_ERROR: "Payment was declined. Please check your details and try again.",
        GATEWAY_ERROR: "Your bank could not process this payment. Try a different card or UPI.",
        SERVER_ERROR: "Payment server error. Please try again in a moment.",
    };

    if (codeMap[code]) return codeMap[code];

    if (step === "payment_authentication")
        return "Authentication failed (wrong OTP or cancelled). Please try again.";
    if (step === "payment_authorization")
        return "Your bank declined this payment. Please try another method.";

    return description || "Payment failed. Please try again or contact support.";
}