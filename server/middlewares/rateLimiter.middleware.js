import { rateLimit } from 'express-rate-limit'
import { ApiError } from "../utils/ApiError.js";

// Brute-Force aur Spam se bachane ke liye strict limiter
//Auth Limiter: only 5 attempts per 15 minutes for sensitive auth routes like login, register, forgot-password, reset-password, and google auth.
 const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes ka window
    max: 5, // Ek IP se max 5 requests allowed hain
    handler: (req, res, next) => {
        throw new ApiError(429, "Too many attempts from this IP. Please try again after 15 minutes.");
    },
    standardHeaders: true, // `RateLimit-*` headers response mein bhejega
    legacyHeaders: false, // X-RateLimit-* headers disable karega
    ipv6Subnet: 64, // IPv6 ke liye /64 subnet tak consider karega
});

// Global limiter is applied to all routes to prevent abuse and ensure fair usage across the application.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Ek IP se max 100 requests normal browsing ke liye ok hain
    handler: (req, res, next) => {
        throw new ApiError(429, "Too many requests from this IP. Please try again later.");
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export {authRateLimiter, globalLimiter};