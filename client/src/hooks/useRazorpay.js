// src/hooks/useRazorpay.js
// Loads the Razorpay checkout script dynamically.
// Singleton pattern — script is only ever appended once per browser session.

import { useState, useEffect, useCallback } from "react";

const SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

let _promise = null; // the in-flight or resolved load promise
let _loaded = false; // true once window.Razorpay is confirmed present
let _failed = false; // true if the last attempt errored

function loadSDK() {
    if (window.Razorpay) {
        _loaded = true;
        return Promise.resolve();
    }

    if (_promise) return _promise;

    _failed = false;

    _promise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${SDK_URL}"]`);
        if (existing) {
            if (window.Razorpay) {
                _loaded = true;
                return resolve();
            }
            existing.addEventListener("load", () => { _loaded = true; resolve(); });
            existing.addEventListener("error", () => { _failed = true; _promise = null; reject(); });
            return;
        }

        const script = document.createElement("script");
        script.src = SDK_URL;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            _loaded = true;
            resolve();
        };

        script.onerror = () => {
            _failed = true;
            _promise = null;
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            reject(new Error("Script load failed"));
        };

        document.body.appendChild(script);
    });

    return _promise;
}

export function useRazorpay() {
    const [sdkReady, setSdkReady] = useState(_loaded);
    const [sdkError, setSdkError] = useState(
        _failed ? "Payment system failed to load. Check your connection." : null
    );
    const [loading, setLoading] = useState(false);

    const attemptLoad = useCallback(() => {
        if (_loaded && window.Razorpay) {
            setSdkReady(true);
            setSdkError(null);
            return;
        }

        setLoading(true);
        setSdkError(null);

        loadSDK()
            .then(() => {
                setSdkReady(true);
                setSdkError(null);
                setLoading(false);
            })
            .catch(() => {
                setSdkReady(false);
                setSdkError(
                    "Payment system could not load. Check your connection or disable ad blockers."
                );
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        attemptLoad();
    }, [attemptLoad]);

    const retry = useCallback(() => {
        _promise = null;
        _failed = false;
        attemptLoad();
    }, [attemptLoad]);

    return {
        sdkReady,
        sdkError,
        sdkLoading: loading,
        retry,
    };
}