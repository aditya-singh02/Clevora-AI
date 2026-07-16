# Clevora — AI-Powered Mock Interview Platform

> Practice smarter. Get personalized AI feedback. Walk into placements confident.

**Live Demo:** [clevora.vercel.app](https://clevora-ai-ebon.vercel.app/)

**Tech Stack:**
`React` `Node.js` `Express` `MongoDB` `JWT` `Firebase OAuth` `OpenRouter AI` `Razorpay` `Redux Toolkit` `Tailwind CSS`

---

## Table of Contents

1. [Problem](#1-problem)
2. [Solution](#2-solution)
3. [What Clevora Does — User Journey](#3-what-clevora-does--user-journey)
4. [Complete Feature List](#4-complete-feature-list)
5. [System Architecture](#5-system-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Database Design](#7-database-design)
8. [Complete API Reference](#8-complete-api-reference)
9. [Detailed Flows](#9-detailed-flows)
   - [9.1 Authentication Flow](#91-authentication-flow)
   - [9.2 AI Workflow](#92-ai-workflow)
   - [9.3 Interview Session Flow](#93-interview-session-flow)
   - [9.4 Payment Flow](#94-payment-flow)
   - [9.5 Integrity Monitoring Flow](#95-integrity-monitoring-flow)
   - [9.6 Report Generation Flow](#96-report-generation-flow)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Security Implementation](#11-security-implementation)
12. [Design Decisions — Why I Chose What I Chose](#12-design-decisions--why-i-chose-what-i-chose)
13. [Known Issues & What I Would Improve](#13-known-issues--what-i-would-improve)
14. [Future Roadmap](#14-future-roadmap)
15. [Getting Started](#15-getting-started)
16. [Interview Questions & Answers](#16-interview-questions--answers)

---

## 1. Problem

Students preparing for campus placements face three real problems:

**Problem 1 — Generic practice, not personalized**
Every question bank asks the same generic questions — "what is polymorphism," "explain OOPS." A real interviewer who read your resume would ask about YOUR MERN project, YOUR IoT build, YOUR specific skills. Generic banks don't do this.

**Problem 2 — No objective feedback**
When practicing alone, you have no way to know: were you confident? Did you explain clearly? Was the content actually correct? These three things are independent and require separate evaluation.

**Problem 3 — No integrity in self-assessment**
Nothing stops a candidate from Googling answers mid-practice or copy-pasting prepared text — making the score completely meaningless.

---

## 2. Solution

Clevora solves all three:

**Solution 1 — Resume-driven personalization**
Upload your PDF resume. AI reads your actual skills, projects, experience, and education. Every question is generated from YOUR profile — not a bank.

**Solution 2 — AI evaluation on 3 independent axes**
Every answer is scored by an AI on:
- **Confidence** — how assertively did you answer?
- **Communication** — how clearly did you express yourself?
- **Correctness** — was the technical content accurate?

These scores are independent. You can score 9 on confidence and 3 on correctness (confidently wrong) — the report tells you exactly where you're weak.

**Solution 3 — Integrity monitoring**
A custom system tracks tab switches, copy-paste, right-click, and keyboard shortcuts throughout the session. An integrity score is generated alongside the performance score — every report shows both.

---

## 3. What Clevora Does — User Journey

```
STEP 1: Sign Up
  → Email + OTP verification (Gmail only)
  → OR Google OAuth (one click)
  → 100 free credits on signup

STEP 2: Upload Resume
  → PDF upload (max 5MB)
  → AI extracts: role · skills · projects · experience · education
  → User reviews and edits the extracted profile

STEP 3: Configure Interview
  → Pick mode: HR (behavioral) or Technical (role-specific)
  → 20 credits deducted on start
  → AI generates 5 personalized questions:
      Q1 (easy,   60s)
      Q2 (easy,   60s)
      Q3 (medium, 120s)
      Q4 (medium, 120s)
      Q5 (hard,   180s)

STEP 4: Live Interview Session (per question)
  → AI avatar speaks the question aloud (text-to-speech)
  → Countdown timer starts
  → User answers by voice (Web Speech API) OR typing
  → Integrity system silently monitors violations
  → User submits (or timer expires → auto-submit, score = 0)
  → AI evaluates the answer (confidence / communication / correctness)
  → Qualitative feedback shown immediately (score hidden — anti-cheat)

STEP 5: End Interview
  → All 5 answers submitted
  → Scores aggregated (average across all questions)
  → Integrity report compiled from session violations

STEP 6: Performance Report
  → Overall score + confidence / communication / correctness averages
  → Per-question breakdown: answer · AI feedback · 4 individual scores
  → Strengths (score ≥ 7) and weaknesses (score < 7) auto-identified
  → Performance chart (all 4 metrics across 5 questions)
  → Integrity report (violations by type with timestamps)
  → Downloadable PDF

STEP 7: Track Progress
  → All interviews saved in History
  → Dashboard: stats, recent interviews, performance trend chart
  → Gamification: 6 levels based on interview count

STEP 8: Buy Credits (when free credits run out)
  → ₹199 → 500 credits (~25 interviews)
  → ₹349 → 1200 credits (~60 interviews)
  → Razorpay payment with double verification
```

---

## 4. Complete Feature List

### Authentication & Account
| # | Feature | Detail |
|---|---------|--------|
| 1 | Email/Password Registration | Gmail-only, strong password enforced, bcrypt hashing |
| 2 | OTP Email Verification | 6-digit OTP, SHA-256 hashed in DB, 10-min expiry, resend with 30s cooldown |
| 3 | Google OAuth Login | Firebase `signInWithPopup`, backend issues own JWT regardless |
| 4 | Login with Rate Limiting | 5 attempts / 15 min per IP (brute-force protection) |
| 5 | Forgot Password | Crypto token, SHA-256 hashed, 15-min expiry, sent via email |
| 6 | Reset Password | Token verification + last-3-password history check |
| 7 | Multi-provider Account Merging | `authProvider: email \| google \| both` |
| 8 | Logout | Clears JWT httpOnly cookie server-side |
| 9 | Account Deletion | Cascading delete: Interviews → Payments → User |
| 10 | Dark / Light Theme | Context API, persisted to localStorage, Tailwind `dark:` classes |

### Resume & Interview
| # | Feature | Detail |
|---|---------|--------|
| 11 | Resume Upload & AI Parsing | PDF → pdfjs-dist text → OpenRouter LLM → structured JSON |
| 12 | AI Question Generation | 5 questions, fixed 2-easy/2-medium/1-hard distribution, role + resume aware |
| 13 | HR Mode | Behavioral, situational, communication-focused questions |
| 14 | Technical Mode | Role-specific, project-based, problem-solving questions |
| 15 | Voice Answer Recording | Web Speech API (SpeechRecognition), editable transcript |
| 16 | Text Answer Input | Textarea with real-time editing |
| 17 | Countdown Timer | Per-question (60/120/180s), visual ring + color change at <10s |
| 18 | Timer-based Auto-submission | Timer = 0 → auto-submit empty → score 0, no AI call |
| 19 | AI Answer Evaluation | confidence + communication + correctness (0-10 each) + feedback |
| 20 | Anti-cheat Response Shaping | Scores stripped from API response during session |
| 21 | AI Avatar | Text-to-speech reads question, idle/speaking video swap |

### Integrity Monitoring
| # | Feature | Detail |
|---|---------|--------|
| 22 | Tab Switch Detection | Page Visibility API + window blur → -10 per occurrence (max 4) |
| 23 | Paste Detection | Paste event blocked + tracked → -8 per occurrence (max 4) |
| 24 | Right-Click Detection | contextmenu blocked + tracked → -2 per occurrence (max 4) |
| 25 | Keyboard Shortcut Detection | Ctrl+C/V/U/A/S, F12 blocked + tracked → -5 per occurrence (max 4) |
| 26 | Live Violation Toasts | IntegrityWarning shows 4s toast on each violation |
| 27 | Integrity Score | Starts at 100, degrades per violation, saved to DB with timestamps |

### Reports & Dashboard
| # | Feature | Detail |
|---|---------|--------|
| 28 | Performance Report | Overall + per-question scores, strengths/weaknesses, chart |
| 29 | Integrity Report | Score ring, tier (Excellent/Fair/High Risk), per-violation breakdown |
| 30 | PDF Download | Client-side jsPDF + jspdf-autotable, full report in A4 format |
| 31 | Interview History | All past interviews, sorted by date |
| 32 | Dashboard Stats | Total interviews, avg score, best score, total time, favorite role |
| 33 | Performance Chart | Recharts AreaChart, 4 metrics across last 10 completed interviews |
| 34 | Gamification | 6 levels (System Intern → Quantum Overlord), 3 badges |

### Payments & Settings
| # | Feature | Detail |
|---|---------|--------|
| 35 | Credit System | 100 free on signup, 20 per interview, atomic `$inc` updates |
| 36 | Razorpay Integration | Order creation, HMAC signature verify, amount cross-check |
| 37 | Payment Failure Handling | Cancel/fail recorded with reason, status machine (created→paid/failed) |
| 38 | Payment History | All transactions in Settings → Billing |
| 39 | Settings — Account Tab | Email display, password reset (reuses forgot-password flow) |
| 40 | Settings — Billing Tab | Credits, total spent, purchase history |
| 41 | Settings — Notifications Tab | UI toggles (no backend persistence — planned feature) |

### Security & Backend
| # | Feature | Detail |
|---|---------|--------|
| 42 | JWT Auth | httpOnly cookie, 7-day expiry, signed with JWT_SECRET |
| 43 | Global Rate Limiting | 100 req / 15 min per IP (all endpoints) |
| 44 | Auth Rate Limiting | 5 req / 15 min on login, forgot-password, payment routes |
| 45 | Centralized Error Handling | `ApiError` + `asyncHandler` + global error middleware |
| 46 | Consistent API Responses | `ApiResponse` wrapper: `{statusCode, data, message, success}` |
| 47 | Resume Privacy | PDF deleted immediately after parsing, never stored |
| 48 | CORS | Restricted to `CORS_ORIGIN` env variable |

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      CLIENT (React SPA)                         │
│                                                                  │
│  React 19 · Vite · React Router · Redux Toolkit                 │
│  redux-persist · Tailwind CSS · Framer Motion · Recharts        │
│  Web Speech API · jsPDF · Firebase SDK                          │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           │  axios (withCredentials: true)
                           │  JWT stored in httpOnly cookie
                           │  cross-origin — CORS restricted
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                   SERVER (Express.js / Node.js)                  │
│                                                                  │
│  Middleware chain (executes in this ORDER on every request):    │
│  1. cors()               → restrict allowed origins             │
│  2. express.json()       → parse JSON request body             │
│  3. express.urlencoded() → parse form data (16kb limit)        │
│  4. cookieParser()       → make cookies available in req       │
│  5. globalLimiter        → 100 req/15min per IP                │
│  6. Routes               → /auth · /user · /interview · /pay   │
│  7. Global error handler → catches ALL thrown errors (last)    │
│                                                                  │
│  /api/v1/auth      → 7 endpoints                               │
│  /api/v1/user      → 2 endpoints                               │
│  /api/v1/interview → 6 endpoints                               │
│  /api/v1/payment   → 4 endpoints                               │
└──────┬───────────┬──────────────┬───────────────────────────────┘
       │           │              │                    │
  ┌────▼───┐  ┌───▼──────┐  ┌───▼──────┐  ┌──────────▼───────┐
  │MongoDB │  │OpenRouter│  │Razorpay  │  │Gmail SMTP        │
  │Atlas   │  │LLM API   │  │API       │  │(Nodemailer)      │
  │        │  │          │  │          │  │                  │
  │User    │  │Resume    │  │Orders    │  │OTP emails        │
  │Interview│  │parse     │  │Payments  │  │Reset link emails │
  │Payment │  │Q-gen     │  │Verify    │  │                  │
  └────────┘  │Evaluate  │  └──────────┘  └──────────────────┘
              └──────────┘
                    ↑
              One function:
              askAI(messages)
              in openRouter.service.js
              Used by ALL 3 AI features
```

**How each layer communicates:**
- Frontend → Backend: `axios` with `withCredentials:true`, JWT in httpOnly cookie
- Backend → MongoDB: Mongoose queries (`findById`, `find`, `create`, `findByIdAndUpdate`)
- Backend → OpenRouter: `axios.post` to `https://openrouter.ai/api/v1/chat/completions`
- Backend → Razorpay: Razorpay SDK (`orders.create`, `payments.fetch`)
- Backend → Gmail: Nodemailer `transporter.sendMail()`
- Frontend → Firebase: `signInWithPopup()` (client-side only, Google OAuth)

---

## 6. Folder Structure

```
Clevora-AI/
│
├── client/                          → React Frontend
│   └── src/
│       ├── main.jsx                 → Entry point. Wraps app in:
│       │                              Redux Provider → PersistGate
│       │                              → BrowserRouter → ThemeProvider → App
│       │
│       ├── App.jsx                  → Routing + session restoration + route guards
│       │                              Calls /current-user on every load to verify JWT
│       │
│       ├── redux/
│       │   ├── store.js             → Redux store + redux-persist config (key:"user")
│       │   └── userSlice.js         → { userData: null } → setUserData / clearUserData
│       │
│       ├── context/
│       │   └── ThemeContext.jsx     → Dark/Light toggle. Persists to localStorage.
│       │                              Toggles "dark" class on <html> for Tailwind
│       │
│       ├── hooks/                   → ALL reusable logic (no UI here)
│       │   ├── useInterviewSession.js  → Timer, currentIndex, submit/end API calls
│       │   ├── useIntegrity.js         → 4 violation types, scoring, getReport()
│       │   ├── useVoiceRecorder.js     → Web Speech API, transcript, waveform
│       │   ├── useGetAllInterviews.js  → Fetch history. Reused by 6 components
│       │   ├── useInterviewSetup.js    → Upload → AI parse → start interview
│       │   ├── usePayment.js           → Razorpay order/verify orchestration
│       │   ├── useRazorpay.js          → Loads checkout.js ONCE (singleton pattern)
│       │   ├── useCounter.js           → Animates numbers 0→target (landing page)
│       │   └── useCursorGlow.js        → Mouse-tracking glow effect (decorative)
│       │
│       ├── pages/                   → One file per full screen/route
│       │   ├── Home.jsx             → Landing page + Auth modal trigger
│       │   ├── Auth.jsx             → Login/Register/OTP/Forgot/Reset modal
│       │   │                          5 views in one component, switched by state
│       │   ├── Dashboard.jsx        → Post-login home with all widgets
│       │   ├── InterviewSetup.jsx   → Resume upload → config → start (3 steps)
│       │   ├── InterviewSession.jsx → Live Q&A screen (wires 3 hooks together)
│       │   ├── ReportPage.jsx       → Full performance report
│       │   ├── History.jsx          → All past interviews list
│       │   ├── PaymentPage.jsx      → Pricing + buy credits
│       │   ├── PaymentSuccess.jsx   → Success screen
│       │   ├── PaymentFailed.jsx    → Failure/cancel screen
│       │   └── SettingPage.jsx      → Account / Billing / Notifications tabs
│       │
│       ├── components/              → UI pieces, organized by feature
│       │   ├── Home/                → Navbar, HeroSection, FeaturesSection,
│       │   │                          HowItWorks, PricingSection, FAQSection,
│       │   │                          AntiCheatSection, StatsSection,
│       │   │                          TestimonialsSection, CTASection, Footer
│       │   │
│       │   ├── Dashboard/           → Sidebar, DashboardHeader, StatsCards,
│       │   │                          RecentInterviews, PerformanceAnalytics,
│       │   │                          GamificationSection, QuickActions, EmptyState
│       │   │
│       │   ├── Interview/
│       │   │   ├── Setup/           → ResumeUploader, ResumePreview, ModeSelector,
│       │   │   │                      StepIndicator, ConfirmStart, SetupSummary
│       │   │   ├── Session/         → AIAvatar, AnswerPanel, FeedbackCard,
│       │   │   │                      CountdownTimer, EndingOverlay,
│       │   │   │                      IntegrityWarning, ProgressBar, QuestionCard
│       │   │   └── Report/          → ScoreHero, QuestionBreakdown, IntegrityReport,
│       │   │                          PerformanceChart, StrengthsWeaknesses,
│       │   │                          ReportActions, ReportTopBar
│       │   │
│       │   ├── Payment/             → PricingCard, LoadingOverlay, PaymentStatusBanner
│       │   ├── Settings/            → AccountTab, BillingTab, NotificationTab
│       │   └── ui/                  → GlassCard, FadeIn, FadeIn, NeuralBg,
│       │                              TestimonialCard, FeatureCard (reusable across all)
│       │
│       ├── data/
│       │   ├── generatePdfReport.js → Client-side PDF generation (jsPDF)
│       │   ├── pricing.js           → Plan definitions (Starter/Pro/Expert)
│       │   ├── features.js          → Landing page feature cards data
│       │   ├── faq.js               → Landing page FAQ data
│       │   ├── companies.js         → Trusted companies logos (landing page)
│       │   └── testimonials.js      → Testimonial cards data (landing page)
│       │
│       ├── services/
│       │   └── payment.service.js   → Axios wrappers for payment API calls
│       │
│       └── utils/
│           └── firebase.js          → Firebase app init + Google auth provider
│
│
└── server/                          → Express Backend
    ├── app.js                       → Express setup, middleware chain, route
    │                                  mounting, global error handler
    ├── index.js                     → Entry: connectDB() → app.listen(PORT)
    │
    ├── config/
    │   ├── connectDB.js             → mongoose.connect(). Exits process on failure
    │   └── token.js                 → genToken(userId) → jwt.sign({userId},secret,7d)
    │
    ├── controllers/                 → Business logic per feature domain
    │   ├── auth.controller.js       → register, login, google, verifyOtp,
    │   │                              forgotPassword, resetPassword, logout
    │   ├── user.controller.js       → getCurrentUser, deleteAccount
    │   ├── interview.controller.js  → analyzeResume, startInterview, submitAnswer,
    │   │                              endInterview, getMyInterviews, getInterviewReport
    │   └── payment.controller.js    → createOrder, verifyPayment,
    │                                  handleFailedPayment, getPaymentHistory
    │
    ├── middlewares/
    │   ├── auth.middleware.js       → verifyJWT (reads cookie OR Bearer header)
    │   ├── multer.middleware.js     → diskStorage → ./public/temp, 5MB max
    │   └── rateLimiter.middleware.js→ authRateLimiter (5/15min) + globalLimiter (100/15min)
    │
    ├── models/
    │   ├── user.model.js            → User schema + pre("save") bcrypt hook
    │   │                              + isPasswordCorrect() instance method
    │   ├── interview.model.js       → Interview + embedded questions[] + integrityReport
    │   └── payment.model.js         → Payment (Razorpay records + status machine)
    │
    ├── routes/                      → URL-to-controller mapping ONLY (no logic here)
    │   ├── auth.route.js
    │   ├── user.route.js
    │   ├── interview.route.js       → includes multer middleware for /resume
    │   └── payment.route.js
    │
    ├── services/                    → External API wrappers (change provider = change 1 file)
    │   ├── openRouter.service.js    → askAI(messages) → OpenRouter API
    │   ├── razorpay.service.js      → Razorpay SDK instance
    │   └── email.service.js         → sendOTPEmail() + sendPasswordResetEmail()
    │
    ├── utils/
    │   ├── asyncHandler.js          → Higher-order fn: auto-catches async errors
    │   ├── ApiError.js              → Custom Error class with statusCode
    │   └── ApiResponse.js           → Standard success response wrapper
    │
    └── public/temp/                 → Temp storage for uploaded PDFs (deleted after parse)
```

**Key architectural rule:** Routes contain NO logic. Controllers contain ALL business logic. Services wrap ALL external APIs. This means swapping a service (e.g., OpenRouter → OpenAI) touches exactly ONE file.

---

## 7. Database Design

### Three Collections

---

### Collection 1: User

```js
{
  name:                 String,           // display name
  email:                String,           // unique, lowercase — always @gmail.com
  password:             String,           // bcrypt hash. null for Google-only users
  passwordHistory:      [String],         // last 3 bcrypt hashes — prevents password reuse
  authProvider:         "email|google|both", // tracks login method(s) used
  credits:              Number,           // default: 100. The entire economy is this field
  isVerified:           Boolean,          // false until OTP verified
  otp:                  String,           // SHA-256 hash of OTP. null after verification
  otpExpiry:            Date,             // 10 minutes from generation
  resetPasswordToken:   String,           // SHA-256 hash. null when not resetting
  resetPasswordExpiry:  Date,             // 15 minutes from generation
  createdAt, updatedAt                    // auto via timestamps: true
}
```

**Schema-level logic (automatic — not in controllers):**
```js
// Runs automatically before EVERY user.save()
// If password changed → hash it. Controllers NEVER call bcrypt manually.
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Called as: const isMatch = await user.isPasswordCorrect(submittedPassword)
userSchema.methods.isPasswordCorrect = async function(password) {
  return bcrypt.compare(password, this.password);
};
```

---

### Collection 2: Interview

```js
{
  userId:      ObjectId (ref: "User"),    // who took this interview
  role:        String,                    // e.g. "Full Stack Developer"
  experience:  String,                    // e.g. "Fresher", "1-2 years"
  mode:        "HR | Technical",

  resumeText:  String,                    // raw extracted PDF text
  resumeData: {
    skills:    [String],
    projects:  [{ title: String, description: String }],
    education: String
  },

  // EMBEDDED ARRAY — not a separate collection (always read/written together)
  questions: [{
    question:       String,
    difficulty:     "easy | medium | hard",
    timeLimit:      Number,               // 60 / 120 / 180 seconds
    answer:         String,               // what the user submitted
    feedback:       String,               // AI's 10-15 word feedback
    score:          Number (default: 0),  // 0-10 (finalScore from AI)
    confidence:     Number (default: 0),  // 0-10
    communication:  Number (default: 0),  // 0-10
    correctness:    Number (default: 0),  // 0-10
    createdAt, updatedAt
  }],

  finalScore:  Number (default: 0),      // average score across all questions
  status:      "Incomplete | Completed",

  integrityReport: {
    score:           Number,             // starts 100, decreases per violation
    totalViolations: Number,
    violations: [{
      type:       "tab_switch | paste | right_click | keyboard_shortcut",
      count:      Number,
      timestamps: [Date]                 // exact times of each occurrence
    }]
  },
  createdAt, updatedAt
}
```

**Why questions[] is embedded:**
Questions are ALWAYS read and written WITH their parent interview — never independently. One `Interview.findById()` returns the complete report. No joins, no second query, no round-trips.

**Why integrityReport shape matches useIntegrity hook exactly:**
The frontend hook's `getReport()` returns the SAME structure the schema expects. Zero transformation — output sent directly to the backend.

---

### Collection 3: Payment

```js
{
  userId:            ObjectId (ref: "User"),
  planId:            String,               // "pro" or "expert"
  amount:            Number,               // in RUPEES (not paise) — e.g. 199, 349
  credit:            Number,               // credits to award on success (500, 1200)
  razorpayOrderId:   String,               // from Razorpay order creation
  razorpayPaymentId: String,               // from Razorpay after payment succeeds
  status:            "created|paid|failed",
  failReason:        String,               // reason if status is "failed"
  createdAt, updatedAt
}
```

**Payment status machine:**
```
"created" (on /payment/order)
      ↓              ↓
   "paid"         "failed"
(on /verify)   (on /failed)
```

**Why store amount in rupees not paise:**
Human-readable for billing history display. Converted to paise (`× 100`) only when calling Razorpay APIs or comparing amounts during verification.

**Cascading delete — application-level (MongoDB has no foreign-key cascades):**
```js
await Interview.deleteMany({ userId });   // delete all interviews first
await Payment.deleteMany({ userId });     // then all payments
await User.findByIdAndDelete(userId);     // then the user
```

---

## 8. Complete API Reference

**Every response follows this shape:**
```js
// Success
{ statusCode: 200, data: { ... }, message: "...", success: true }

// Error
{ statusCode: 400, message: "...", success: false, errors: [] }
```

---

### Auth Endpoints `/api/v1/auth`

| Method | Route | Purpose | Auth | Rate Limit |
|--------|-------|---------|------|------------|
| POST | `/register` | Create account, send OTP email | No | Global only |
| POST | `/verify-otp` | Verify OTP → issue JWT cookie | No | Global only |
| POST | `/login` | Email/password login | No | authRateLimiter |
| POST | `/google` | Google OAuth login/register | No | Global only |
| POST | `/forgot-password` | Send reset link to email | No | authRateLimiter |
| POST | `/reset-password` | Set new password with token | No | Global only |
| POST | `/logout` | Clear JWT cookie | Yes | Global only |

**POST `/register`**
```
Body:     { name, email, password, confirmPassword }
Validates: @gmail.com only | strong password regex | passwords match
Process:  User.create() → pre-save bcrypt hook → OTP generated
          → SHA-256(otp) stored → raw otp emailed (Nodemailer)
Response: { email } | "OTP sent to your Gmail"
Errors:   400 weak pwd | 400 mismatch | 400 non-gmail | 409 already verified
Special:  If unverified user exists → regenerate OTP, resend (200)
          If Google-only user → 400 "use Google login"
```

**POST `/verify-otp`**
```
Body:     { email, otp }
Process:  SHA-256(submitted otp) → find user where otp=hash AND otpExpiry>now
          → isVerified=true → clear OTP fields → genToken() → set cookie
Response: User object | Sets httpOnly cookie "token" (7 days)
Errors:   404 invalid/expired OTP | 400 already verified
```

**POST `/login`** *(authRateLimiter: 5/15min)*
```
Body:     { email, password }
Pre-check: @gmail.com | password.length >= 8 (before DB hit — saves cost)
Process:  User.findOne({email}) → user.isPasswordCorrect(password)
          → bcrypt.compare(plain, hash) → genToken() → cookie
Response: User object
Errors:   404 not found | 400 Google-only account | 401 wrong password
```

**POST `/google`**
```
Body:     { name, email }   ← from Firebase signInWithPopup result
Process:  Find/create user → set authProvider ("google" or upgrade to "both")
          → genToken() → set cookie
Response: User object
Note:     No authRateLimiter — Firebase is already gating this
```

**POST `/forgot-password`** *(authRateLimiter)*
```
Body:     { email }
Process:  rawToken = crypto.randomBytes(32).toString("hex")
          hashedToken = SHA-256(rawToken)  ← stored in DB
          raw token sent in email link     ← NEVER stored in DB
          expiry: 15 minutes
Response: "Password reset link sent"
```

**POST `/reset-password`**
```
Body:     { email, token, newPassword, confirmNewPassword }
Process:  SHA-256(submitted token) → match with DB hash + check expiry
          → loop passwordHistory: bcrypt.compare(newPwd, each old hash)
          → pre-save hook hashes new password → save → clear reset fields
          → if authProvider === "google" → upgrade to "both"
Response: "Password reset successfully. Please login."
Errors:   400 invalid/expired token | 400 password reuse (last 3)
Note:     No rate limit — access requires possession of a secure emailed token
```

**POST `/logout`** *(verifyJWT)*
```
Process:  res.clearCookie("token", { httpOnly, secure, sameSite:"None" })
Response: {} | "Logged out successfully"
⚠️ KNOWN BUG: Frontend calls /api/v1/user/logout (wrong URL)
   Actual route is /api/v1/auth/logout
   Cookie never actually cleared — see Section 13
```

---

### User Endpoints `/api/v1/user`

**GET `/current-user`** *(verifyJWT)*
```
Purpose:  Called by App.jsx on EVERY page load to verify session is still valid
          If cookie valid → return user. If expired/invalid → 401 → redirect to home
Response: req.user (logged-in user object)
```

**DELETE `/delete-account`** *(verifyJWT)*
```
Process:  Interview.deleteMany({userId})   → all interviews
          Payment.deleteMany({userId})     → all payments
          User.findByIdAndDelete(userId)   → the user
Response: {} | "User account deleted successfully"
Security: Uses req.user._id — users can only delete their own account
```

---

### Interview Endpoints `/api/v1/interview`

**POST `/resume`** *(verifyJWT + multer.single("resume"))*
```
Request:  multipart/form-data, field "resume" (PDF, max 5MB)
Process:  multer saves to ./public/temp/
          pdfjs-dist: for each page → getTextContent() → join → concatenate all pages
          clean: resumeText.replace(/\s+/g, " ").trim()
          askAI([systemPrompt(JSON schema + rules), userPrompt(resumeText)])
          aiResponse.replace(/```json|```/g, "").trim() → JSON.parse()
          fs.unlinkSync(filePath)  ← ALWAYS deleted, even on error
Response: { role, experience[], projects[{title,description}], skills[], education }
Errors:   400 no file | 500 AI failure | 500 JSON parse failure
⚠️ UI shows "Max 10MB" but backend limit is 5MB (mismatch)
```

**POST `/start`** *(verifyJWT)*
```
Body:     { role, experience, mode, resumeText, resumeData }
Process:  1. validate fields present
          2. check user.credits >= 20  ← BEFORE AI call (save cost on insufficient credits)
          3. build userPrompt from skills/projects/resumeText
          4. askAI([questionGenPrompt, userPrompt]) → 5 questions JSON
          5. Interview.create({...questions, status:"Incomplete"})
          6. User.findByIdAndUpdate({$inc:{credits:-20}})  ← AFTER creation (not before)
Response: { interviewId, creditLeft, userName, questions }
          questions stripped to: { _id, question, difficulty, timeLimit }
          answer/score/feedback/confidence STRIPPED → anti-cheat
Errors:   400 missing fields | 400 insufficient credits | 500 AI failure
```

**POST `/submit-answer`** *(verifyJWT)*
```
Body:     { interviewId, questionId, answer, timeTaken }
Process:  Interview.findById() → find question in questions[] by _id
          IF answer.trim() === "" OR timeTaken > timeLimit:
            → score=0, feedback="did not answer/exceeded time", NO AI call
          ELSE:
            → askAI([evaluationRubricPrompt, "Question:X\nAnswer:Y"])
            → parse {confidence, communication, correctness, finalScore, feedback}
            → update question subdocument → interview.save()
Response: { feedback }  ← ONLY feedback. Scores hidden until /end (anti-cheat)
⚠️ KNOWN BUG: No ownership check here (unlike endInterview which has one)
```

**POST `/end`** *(verifyJWT)*
```
Body:     { interviewId, integrityReport }
Process:  ownership check: interview.userId === req.user._id
          IF already "Completed" → return existing (idempotent — no recompute)
          ELSE: average score/confidence/communication/correctness across all questions
                save integrityReport → status = "Completed"
Response: { finalScore, confidence, communication, correctness,
            questionWiseScore[], integrityReport }
```

**GET `/get-my-interviews`** *(verifyJWT)*
```
Process:  Interview.find({ userId }).sort({ createdAt: -1 })
          .select("role experience mode finalScore status createdAt updatedAt")
          Only summary fields — NOT full questions[] (bandwidth optimization)
Response: Array of interview summaries
```

**GET `/report/:interviewId`** *(verifyJWT)*
```
Process:  ownership check → compute averages → build report structure
Response: { metaData, overallScores, questionWisePerformance[] }
```

---

### Payment Endpoints `/api/v1/payment`

**POST `/order`** *(verifyJWT + authRateLimiter)*
```
Body:     { planId, amount, credit }
Process:  razorpay.orders.create({ amount: amount*100, currency: "INR" })
          Payment.create({ userId, planId, amount, credit, razorpayOrderId, status:"created" })
Response: Razorpay order object { id, amount, currency, receipt }
```

**POST `/verify`** *(verifyJWT + authRateLimiter)*
```
Body:     { razorpayPaymentId, razorpayOrderId, razorpaySignature }
Process:  Step 1 — Signature: HMAC-SHA256(orderId+"|"+paymentId, secret) === signature?
          Step 2 — Amount:    razorpay.payments.fetch(paymentId)
                              confirm fetched.amount === Payment.amount * 100
          Step 3 — Idempotent: if Payment.status === "paid" → return (no double-credit)
          Step 4 — Credit:   Payment.status="paid"
                              User.findByIdAndUpdate({$inc:{credits: credit}}, {new:true})
Response: { user: updatedUser }
```

**POST `/failed`** *(verifyJWT + authRateLimiter)*
```
Body:     { razorpayOrderId, reason }
Process:  Payment.status = "failed", failReason = reason
Response: {} | "Failure recorded"
```

**GET `/history`** *(verifyJWT)*
```
Process:  Payment.find({ userId }).sort({ createdAt: -1 })
Response: Array of payment records
```

---

## 9. Detailed Flows

---

### 9.1 Authentication Flow

#### A. Registration + OTP Verification

```
User fills Register form (Auth.jsx)
        │
        ▼
Frontend validation:
  ✓ All fields filled
  ✓ password === confirmPassword
  ✓ isStrongPassword() check
    (PWD_RULES: 8+ chars, uppercase, lowercase, number, special char)
    (These rules mirror backend regex EXACTLY)
        │
        ▼
POST /api/v1/auth/register
        │
        ▼
registerUser controller:
  1. email must end with @gmail.com
  2. password strength regex check
  3. password === confirmPassword
  4. User.findOne({ email })
       → not found        → proceed
       → !isVerified      → regenerate OTP, resend (return 200)
       → google-only      → 400 "use Google login"
       → verified         → 409 "already registered"
  5. User.create({ name, email, password, authProvider:"email", credits:100 })
       → pre("save") hook fires: bcrypt.hash(password, 10)
  6. passwordHistory.push(hashedPassword) → cap at 3 (shift oldest)
  7. otp = Math.floor(100000 + Math.random() * 900000).toString()
     hashedOtp = SHA-256(otp)
     user.otp = hashedOtp
     user.otpExpiry = Date.now() + 10 minutes
     user.save({ validateBeforeSave: false })
  8. sendOTPEmail(email, rawOtp, name) via Nodemailer
  9. return { email } — NO cookie yet. JWT only after OTP verification.
        │
        ▼
Frontend: switches to OTP view
  → starts 30s resend countdown (resendTimer)
  → shows 6 separate input boxes (auto-focus on digit entry)
  → resend = call /register again with same email
        │
        ▼
User enters OTP → clicks Verify
        │
        ▼
POST /api/v1/auth/verify-otp { email, otp }
        │
        ▼
verifyOtp controller:
  1. hashedOtp = SHA-256(submitted otp)
  2. User.findOne({ email, otp: hashedOtp, otpExpiry: { $gt: Date.now() } })
     → not found → 404 "Invalid or expired OTP"
  3. user.isVerified = true | clear otp/otpExpiry
     user.save({ validateBeforeSave: false })
  4. token = genToken(user._id)
     → jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  5. res.cookie("token", token, {
       httpOnly: true,     ← JS cannot read (XSS protection)
       secure: true,       ← HTTPS only
       sameSite: "None",   ← required for cross-origin
       maxAge: 7 days
     })
  6. return user object
        │
        ▼
Frontend: dispatch(setUserData(user)) → navigate("/")
```

#### B. Login Flow

```
POST /api/v1/auth/login  [authRateLimiter: 5 attempts / 15 min / IP]
        │
        ▼
loginUser controller:
  1. Validate fields | @gmail.com check | password.length >= 8 (pre-check)
  2. User.findOne({ email }) → 404 if not found
  3. if authProvider === "google" && !user.password → 400 "use Google login"
  4. await user.isPasswordCorrect(password) → bcrypt.compare
     → false → 401 "Invalid password"
  5. genToken() → set cookie → return user
        │
        ▼
Frontend: dispatch(setUserData(data.data)) → navigate("/dashboard")
```

#### C. Google OAuth Flow

```
Auth.jsx → handleGoogle()
        │
        ▼
Firebase: signInWithPopup(auth, googleProvider)
  Firebase handles ENTIRE OAuth2 flow (redirect, token exchange, CSRF)
  returns: result.user = { displayName, email }
        │
        ▼
POST /api/v1/auth/google { name: displayName, email }
        │
        ▼
googleAuth controller:
  User.findOne({ email }):
  → not found          → User.create({ name, email, authProvider:"google", credits:100 })
  → authProvider=email → upgrade to "both"
  → authProvider=google or both → no change
  genToken() → set cookie → return user
        │
        ▼
Frontend: dispatch(setUserData(user)) → navigate("/dashboard")
```

**Why Firebase + own JWT?**
Firebase verifies "is this a real Google account." Clevora issues its own JWT regardless. So `verifyJWT` middleware works identically regardless of login method — ONE session system, not two.

#### D. Forgot / Reset Password

```
POST /api/v1/auth/forgot-password [authRateLimiter]
        │
        ▼
  rawToken = crypto.randomBytes(32).toString("hex")  ← RAW
  hashedToken = SHA-256(rawToken)                     ← stored in DB
  user.resetPasswordToken = hashedToken
  user.resetPasswordExpiry = Date.now() + 15 min
  email sent: ${CLIENT_URL}/reset-password?token=RAW&email=EMAIL
  (Raw token only in email — never in DB)
        │
        ▼
User clicks email link → Home.jsx URL has ?token=...&email=...
  → Auth.jsx useEffect detects params → auto-opens modal in "reset" view
        │
        ▼
POST /api/v1/auth/reset-password { email, token, newPassword, confirmNewPassword }
        │
        ▼
  1. Strong password check + match check
  2. hashedToken = SHA-256(submitted token)
  3. User.findOne({ email, resetPasswordToken: hashedToken,
                    resetPasswordExpiry: { $gt: Date.now() } })
     → not found → 400 "Invalid or expired token"
  4. for each hash in passwordHistory:
       bcrypt.compare(newPassword, hash)
       → match → 400 "Cannot reuse last 3 passwords"
  5. user.password = newPassword → pre-save hook hashes it
  6. passwordHistory.push(newHash), cap at 3
  7. clear reset fields
  8. if authProvider === "google" → upgrade to "both"
        │
        ▼
Frontend: success message → auto-switch to login view after 2s
         window.history.replaceState() → cleans URL params
```

#### E. verifyJWT Middleware

```
Runs on EVERY protected route BEFORE the controller:
        │
        ▼
  token = req.cookies?.token
       || req.header("Authorization")?.replace("Bearer ", "")
  → no token → throw ApiError(401, "No token provided")

  decoded = jwt.verify(token, JWT_SECRET)
  → expired/invalid → throws TokenExpiredError (caught by asyncHandler → 401)

  user = await User.findById(decoded.userId).select("__v")
  ⚠️ KNOWN BUG: .select("__v") is an INCLUSION projection
     Returns ONLY _id + __v. Intent was to EXCLUDE sensitive fields.
     Should be: .select("-password -otp -otpExpiry -resetPasswordToken
                          -resetPasswordExpiry -passwordHistory")

  if !user → throw ApiError(401, "Invalid token")
  req.user = user
  next()
```

**Two token sources supported:**
Cookie (browser/web) OR `Authorization: Bearer` header (Postman/mobile testing).

---

### 9.2 AI Workflow

#### The AI Service Layer

All 3 AI features use ONE function in `services/openRouter.service.js`:

```js
askAI(messages) {
  POST https://openrouter.ai/api/v1/chat/completions
  {
    model: "openai/gpt-oss-120b:free",
    messages: messages   // [{ role:"system", content:"..." }, { role:"user", content:"..." }]
  }
  returns: response.data.choices[0].message.content (string)
}
```

**Why one function for all AI features:**
Swap the model by changing ONE string. All 3 features automatically use the new model. Controllers never deal with HTTP/axios for AI directly.

---

#### AI Call 1: Resume Parsing

```
Trigger: POST /api/v1/interview/resume

PDF file (max 5MB)
        │
        ▼
pdfjs-dist:
  for each page: page.getTextContent()
                 → items.map(item => item.str).join(" ")
  concatenate all pages
  clean: replace(/\s+/g, " ").trim()
        │
        ▼
System Prompt (key rules):
  "You are a resume parser. Extract in STRICT JSON format:
   { role, experience[], projects:[{title,description}], skills[], education }
   RULES:
   - Return ONLY JSON. No extra text.
   - If section missing: return [] — NEVER null, NEVER omit the key.
   - Clean and deduplicate skills from all sections combined."

Why "never null, always []":
  Frontend does .map() and .join() on these arrays.
  null.map() → CRASH. [].map() → safe empty array.
        │
        ▼
aiResponse.replace(/```json|```/g, "").trim() → JSON.parse()
fs.unlinkSync(filePath)  ← file deleted ALWAYS (success or failure)
        │
        ▼
return { role, experience[], projects[], skills[], education }
```

---

#### AI Call 2: Question Generation

```
Trigger: POST /api/v1/interview/start (after credit check passes)

System Prompt (key rules):
  "You are a professional {mode} interviewer at a top tech company.
   Generate exactly 5 questions based on the candidate's profile.

   DIFFICULTY DISTRIBUTION (strict — no variation):
   Q1: easy   (timeLimit: 60)
   Q2: easy   (timeLimit: 60)
   Q3: medium (timeLimit: 120)
   Q4: medium (timeLimit: 120)
   Q5: hard   (timeLimit: 180)

   RULES:
   - Questions must be specific to their ACTUAL skills and projects
   - NOT generic textbook questions
   - Calibrate to their experience level: {experience}
   - Mode specific:
     HR → behavioral, situational, communication
     Technical → concepts, problem-solving, project-based
   - Return ONLY a JSON array. No extra text. No numbering. No markdown."

User Prompt:
  "Role: {role}
   Experience: {experience}
   Mode: {mode}
   Skills: {skills.join(", ")}
   Projects: {projects.map(p => title+": "+description).join(" | ")}
   Resume: {resumeText.substring(0, 500)}"
        │
        ▼
JSON.parse(cleaned) → questionsArray (5 items)
        │
        ▼
Interview.create({ userId, role, experience, mode,
                   resumeText, resumeData, questions, status:"Incomplete" })
User.findByIdAndUpdate(userId, { $inc: { credits: -20 } })
        │
        ▼
ANTI-CHEAT RESPONSE SHAPING:
  questions.map(q => ({ _id, question, difficulty, timeLimit }))
  ← strips: answer, score, feedback, confidence, communication, correctness
        │
        ▼
return { interviewId, creditLeft, userName, questions }
```

**Why deduct AFTER creation, not before:**
If the AI fails or DB write fails, the interview doesn't exist. User shouldn't be charged for something they didn't receive.

---

#### AI Call 3: Answer Evaluation

```
Trigger: POST /api/v1/interview/submit-answer

For EACH question (up to 5 times):
        │
        ▼
IF answer.trim() === "" OR timeTaken > timeLimit:
  → score=0, confidence=0, communication=0, correctness=0
  → feedback = "did not provide an answer" / "exceeded time limit"
  → NO AI CALL (saves cost, consistent handling)
        │
ELSE:
        ▼
System Prompt (evaluation rubric):
  "Evaluate on 3 dimensions (0-10 each):

   CONFIDENCE:
   0-3: hesitant, unclear
   4-6: somewhat confident
   7-8: clear, assured
   9-10: highly confident, authoritative

   COMMUNICATION:
   0-3: poorly structured
   4-6: understandable but could be clearer
   7-8: clear, well-organized
   9-10: excellent clarity, professional

   CORRECTNESS:
   0-3: mostly wrong or no attempt
   4-6: partially correct, some gaps
   7-8: largely correct, minor gaps
   9-10: completely accurate and thorough

   finalScore = average of three (computed by AI)
   feedback = 10-15 words. Real interview feel.
              Do NOT repeat the question.
              Be realistic. Do NOT give high scores without merit.

   Return ONLY JSON: {confidence, communication, correctness, finalScore, feedback}"

User Prompt:
  "Question: {question.question}
   Answer: {answer}"
        │
        ▼
Parse AI response → update question subdocument:
  question.answer = answer
  question.feedback = feedback
  question.confidence = confidence
  question.communication = communication
  question.correctness = correctness
  question.score = finalScore
interview.save()
        │
        ▼
return { feedback }   ← ONLY. Scores saved in DB but NOT sent to frontend.
```

**Why 3 axes:** "knows the answer but communicates poorly" vs "confidently wrong" — can't detect this with one score. Each axis reveals a different weakness.

**Why scores hidden from immediate response:** Prevents mid-interview strategy gaming. Reveals all scores only in final report.

---

### 9.3 Interview Session Flow

```
navigate("/interview/session/:interviewId", { state: { questions } })
        │
        ▼
InterviewSession.jsx mounts — wires 3 hooks:
  ┌─────────────────────────────────────────┐
  │ useInterviewSession (timer + flow)      │
  │ useVoiceRecorder   (speech → text)     │
  │ useIntegrity       (proctoring)        │
  └─────────────────────────────────────────┘
        │
        ▼
For each question (currentIndex: 0 → 4):

  AIAvatar.jsx:
  → window.speechSynthesis.speak(question.question)  ← speaks aloud
  → prefers Google US English voice
  → shows speaking/idle video based on isSpeaking state
  → circular progress bar shows timeLeft / totalDuration (turns red at ≤10s)

  useInterviewSession timer effect:
  → clearInterval(timerRef.current)    ← stop old timer
  → setTimeLeft(question.timeLimit)    ← reset for this question
  → setFeedback(null)                  ← clear previous feedback
  → questionStartRef.current = Date.now()

  setInterval every 1000ms:
  → setTimeLeft(prev => prev - 1)
  → if timeLeft === 0:
      clearInterval()
      handleSubmitAnswer("")  ← auto-submit empty (score = 0)

  User answers:
  Voice: SpeechRecognition.onresult → transcript + interimText
  Text:  AnswerPanel textarea → directly to transcript state
  (transcript is EDITABLE — user can fix speech recognition errors)

  User submits (or timer = 0):
  → stopRecording()
  → timeTaken = (Date.now() - questionStartRef.current) / 1000
  → setIsSubmitting(true)
  → POST /interview/submit-answer
    { interviewId, questionId, answer: transcript, timeTaken }
  → response: { feedback }
  → setFeedback(feedback) → FeedbackCard renders
  → setIsSubmitting(false)

  User clicks "Next Question":
  → if currentIndex < 4: currentIndex++
  → if currentIndex === 4: handleEndInterview()

handleEndInterview():
  → setIsEnding(true)
  → integrityReport = getReport()  ← from useIntegrity
  → POST /interview/end { interviewId, integrityReport }
  → EndingOverlay shows 2s ("Compiling Session Matrix...")
  → navigate("/interview/report/:id", { state: { report } })
```

---

### 9.4 Payment Flow

```
User selects plan → clicks Buy
        │
        ▼
usePayment.initiatePayment(plan):

  Step 1: Create Order
  POST /api/v1/payment/order { planId, amount, credit }
  → razorpay.orders.create({ amount: amount*100, currency:"INR" })
  → Payment.create({ status: "created", razorpayOrderId: order.id })
  → return Razorpay order
        │
        ▼
  Step 2: Load Razorpay Script (useRazorpay singleton)
  → if already loaded: use cached promise (module-level variables)
  → if not: inject <script src="https://checkout.razorpay.com/v1/checkout.js">
  → wait for load event
        │
        ▼
  Step 3: Open Razorpay Modal
  new window.Razorpay({
    key: VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    order_id: order.id,
    handler: onPaymentSuccess,
    modal: { ondismiss: onDismiss }
  }).open()
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
  User pays successfully           User cancels / payment fails
        │                                  │
        ▼                                  ▼
  handler({ razorpayPaymentId,       POST /payment/failed
    razorpayOrderId,                 { razorpayOrderId, reason }
    razorpaySignature })             Payment.status = "failed"
        │                            navigate("/payment/failure")
        ▼
  POST /payment/verify
        │
        ▼
  verifyPayment controller:
    Step A (Signature):
      HMAC-SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
      compare === razorpaySignature
      → mismatch → 400 "Invalid payment signature"

    Step B (Amount — double verification):
      paymentDetails = await razorpay.payments.fetch(razorpayPaymentId)
      paymentDetails.amount === Payment.amount * 100
      → mismatch → 400 "Amount mismatch"

    Step C (Idempotency):
      if Payment.status === "paid" → return existing user (no double-credit)

    Step D (Credit):
      Payment.status = "paid"
      User.findByIdAndUpdate(userId, { $inc: { credits: credit } }, { new: true })
        │
        ▼
  dispatch(setUserData(updatedUser))
  navigate("/payment/success")
```

**Why double verify (Signature + Razorpay API fetch):**
Signature proves the response wasn't tampered in transit. But it doesn't prove the AMOUNT. A valid signature for a ₹199 payment could be replayed against a ₹349 payment record. The second check — fetching directly from Razorpay's API and comparing amounts — closes this gap. Both must pass.

---

### 9.5 Integrity Monitoring Flow

```
InterviewSession mounts → useIntegrity() initializes:
        │
        ▼
Internal refs (source of truth — not state):
  violationsRef.current = {
    tab_switch:        { count:0, timestamps:[], deduction:10, cap:4 },
    paste:             { count:0, timestamps:[], deduction:8,  cap:4 },
    right_click:       { count:0, timestamps:[], deduction:2,  cap:4 },
    keyboard_shortcut: { count:0, timestamps:[], deduction:5,  cap:4 }
  }
  scoreRef.current = 100
  totalRef.current = 0

Event listeners registered:
  document.addEventListener("visibilitychange", handleTabSwitch)
  window.addEventListener("blur", handleTabSwitch)
  document.addEventListener("paste", handlePaste)          ← + preventDefault()
  document.addEventListener("contextmenu", handleRightClick)  ← + preventDefault()
  document.addEventListener("keydown", handleKeyboard)
    (blocks: Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+A, Ctrl+S, F12)
        │
        ▼
On EACH violation (example: paste):
  data = violationsRef.current["paste"]

  if data.count < 4:  ← respect cap
    data.count++
    data.timestamps.push(new Date())
    totalRef.current++
    scoreRef.current -= 8  ← deduction (max -32 total for paste)
    score never goes below 0

  sync to state (triggers re-render):
    setViolations({ ...violationsRef.current })
    setIntegrityScore(scoreRef.current)

  IntegrityWarning toast shows for 4 seconds
        │
        ▼
End of session → getReport() called:
  return {
    score: scoreRef.current,
    totalViolations: totalRef.current,
    violations: Object.entries(violationsRef.current).map(([type, data]) => ({
      type, count: data.count, timestamps: data.timestamps
    }))
  }
  ← matches Interview.integrityReport schema exactly
  ← sent to /interview/end with zero transformation
```

**The critical "Why refs, not state" explanation:**

```js
// WRONG — stale closure problem
const [count, setCount] = useState(0);
document.addEventListener("paste", () => {
  console.log(count);  // ALWAYS 0 — captured the initial value, never updates
  setCount(count + 1); // count is always 0 here — this just sets to 1 every time
});

// CORRECT — refs are always current inside closures
const countRef = useRef(0);
document.addEventListener("paste", () => {
  countRef.current++;  // ALWAYS fresh — refs are mutable objects, not captured values
  setCount(countRef.current);  // sync to state only for UI re-render
});
```

---

### 9.6 Report Generation Flow

```
End interview → navigate to /interview/report/:id with state.report

ReportPage.jsx mounts:
  Path A — came directly from interview session:
    location.state?.report exists → use it directly
    no API call needed

  Path B — direct URL / history click / page refresh:
    GET /api/v1/interview/report/:interviewId
    → getInterviewReport controller:
        ownership check
        recompute averages from questions[]
        return { metaData, overallScores, questionWisePerformance[] }
        │
        ▼
Components rendered:

  ScoreHero.jsx:
  → animated counter: 0 → finalScore (60 frames over 1.2s via setInterval)
  → ring color: green (≥8) / indigo (≥6) / amber (<6)
  → grade: Excellent (≥8) / Good (≥6) / Fair (≥4) / Needs Work (<4)
  → 3 MetricCards animate independently: 0 → confidence/communication/correctness

  QuestionBreakdown.jsx:
  → accordion (one open at a time, Q1 default open)
  → per question: user answer | AI feedback | 4 score cells (score/conf/comm/corr)
  → score >= 7 → green badge | < 7 → red badge

  StrengthsWeaknesses.jsx:
  → strengths: questions.filter(q => q.score >= 7)
  → improvements: questions.filter(q => q.score < 7)
  → computed in ReportPage, passed as props

  PerformanceChart.jsx:
  → Recharts AreaChart
  → 4 gradient lines: Score / Confidence / Communication / Correctness
  → X-axis: Q1 → Q5 | Y-axis: 0 to 10

  IntegrityReport.jsx:
  → score ring with tier:
      score ≥ 90 → Excellent (green)
      score ≥ 65 → Fair Progress (amber)
      score < 65 → High Risk Alert (red)
  → only shows violation types where count > 0
  → shows timestamps for each violation

  ReportActions.jsx:
  → Download PDF → generatePdfReport(report, interviewId)
       jsPDF creates A4 doc
       jspdf-autotable builds question breakdown table
       triggers browser download
  → Dashboard → navigate("/dashboard")
```

---

## 10. Frontend Architecture

### Provider Stack (`main.jsx` — outermost to innermost)

```
Redux Provider        → makes Redux store available to all components
  → PersistGate       → waits for localStorage rehydration BEFORE rendering
    → BrowserRouter   → enables client-side routing
      → ThemeProvider → dark/light Context (wraps everything)
        → App         → routing + session verification
```

### Session Restoration (`App.jsx`)

```
App mounts:
  Step 1: PersistGate finishes rehydrating Redux from localStorage
          → persisted userData immediately available (no flash of logged-out state)

  Step 2: useEffect (runs after rehydration):
          GET /api/v1/user/current-user
          → success → dispatch(setUserData(data.data))
          → failure (401 / expired) → userData stays null

  Step 3: checking = false → routes render

While checking = true: spinner shown
→ prevents flash of wrong page content
```

### State Management — Two Tools, Different Purposes

**Redux Toolkit (`redux/userSlice.js`):**
```js
initialState: { userData: null }
reducers: {
  setUserData: (state, action) => { state.userData = action.payload },
  clearUserData: (state) => { state.userData = null }
}
```
Persisted to localStorage via `redux-persist` (key: `"user"`).

**Why Redux for userData:**
`userData.credits` and login status needed by Navbar, Sidebar, Dashboard, Settings, PaymentPage — components with NO parent-child relationship. Redux avoids prop drilling. `redux-persist` avoids re-fetching on refresh.

**Context API (`context/ThemeContext.jsx`):**
```js
const [dark, setDark] = useState(() =>
  localStorage.getItem("clevora-theme") === "dark"  // lazy initializer — runs once
)
useEffect(() => {
  localStorage.setItem("clevora-theme", dark ? "dark" : "light")
  document.documentElement.classList.toggle("dark", dark)  // Tailwind dark: classes
}, [dark])
```
**Why Context for theme:** One boolean, infrequently changed. Context is lighter — no action/reducer machinery needed.

### Custom Hooks — Logic Layer

| Hook | Responsibility | Key React Technique |
|------|---------------|---------------------|
| `useInterviewSession` | Timer, currentIndex, submit/end API calls | setInterval via useRef, cleanup in useEffect return |
| `useIntegrity` | Violation tracking, integrity score | useRef for live counters, useState for UI display |
| `useVoiceRecorder` | SpeechRecognition, transcript | Browser API, compatibility check |
| `useGetAllInterviews` | Fetch interview history | isMounted flag, reused by 6 components |
| `useInterviewSetup` | Upload → parse → start flow | FormData, fallback data on AI failure |
| `usePayment` | Razorpay order → verify orchestration | Async flow, Redux update on success |
| `useRazorpay` | Load checkout.js exactly once | Module-level singleton (_promise/_loaded) |
| `useCounter` | Animate numbers 0→target on scroll | useInView (Framer Motion), setInterval |

### Route Guards

```jsx
// Logged-in users redirected from home to dashboard
<Route path="/" element={
  isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
} />

// Logged-out users redirected from dashboard to home
<Route path="/dashboard" element={
  isUserAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
} />

// isUserAuthenticated = !!userData?.name
```

**Note:** `/interview-setup`, `/interview/session/:id`, `/interview/report/:id`, `/settings`, `/history`, `/pricing` are NOT route-guarded. Backend JWT checks prevent data access — but logged-out users can visually load these pages (UX gap — improvement opportunity).

### `Auth.jsx` — 5 Views in One Component

```
view state: "login" | "register" | "otp" | "forgot" | "reset"
                │
    switchView(v) clears all form state and errors
                │
        ┌───────┼───────────┬──────────┬──────────┐
        ▼       ▼           ▼          ▼          ▼
      login  register      otp       forgot     reset
      form   form+         6 boxes   email      new pwd
             strength      auto      field      + strength
             checker       focus     + 15min    checker
                           backspace  note       + history
                           handler               note
```

Password `StrengthChecker` component:
- Renders below password field during register + reset
- Tests each of 5 `PWD_RULES` in real-time (length, uppercase, lowercase, number, special)
- Shows animated progress bar (Weak/Fair/Good/Strong)
- Mirrors backend regex EXACTLY — instant feedback without round-trip

OTP handling:
- 6 separate `<input>` elements (id: `otp-0` through `otp-5`)
- Auto-focuses next box on digit entry
- Backspace moves focus back
- Resend OTP: calls `/register` again with same email — backend detects unverified user and resends

---

## 11. Security Implementation

### What's Implemented

| Security Measure | How | File |
|----------------|-----|------|
| JWT session | Signed with JWT_SECRET, 7-day expiry, payload = {userId} only | `config/token.js` |
| httpOnly cookie | JS cannot read token → XSS protection | All auth controllers |
| secure + sameSite:None | HTTPS only + cross-origin support | All `res.cookie()` calls |
| Password hashing | bcrypt 10 rounds, automatic via `pre("save")` | `user.model.js` |
| OTP hashing | SHA-256 before storage — raw only in email | `auth.controller.js` |
| Reset token hashing | SHA-256 before storage — raw only in email | `auth.controller.js` |
| Password history | Last 3 hashes, bcrypt.compare on reset | `auth.controller.js` |
| Payment signature | HMAC-SHA256 verify | `payment.controller.js` |
| Payment amount | Server-side Razorpay API cross-check | `payment.controller.js` |
| Payment idempotency | Already-paid check before re-crediting | `payment.controller.js` |
| Auth rate limiting | 5 req/15min on login, forgot-pwd, payment | `rateLimiter.middleware.js` |
| Global rate limiting | 100 req/15min app-wide | `app.js` |
| CORS | Restricted to `CORS_ORIGIN` env var | `app.js` |
| Resume privacy | File deleted immediately after parsing | `interview.controller.js` |
| Anti-cheat response | Scores stripped from API during session | `interview.controller.js` |
| Ownership checks | userId verified on interview end/report | `interview.controller.js` |
| Error handling | Custom errors, no stack traces to client | `ApiError` + `app.js` |

---

## 12. Design Decisions — Why I Chose What I Chose

### Why MongoDB over SQL?

Interview data is hierarchical. One interview has 5 questions, each with 4 scores + feedback + answer. Plus a nested integrity report with variable-length violations array. In SQL: 4+ tables, joins on every report fetch. In MongoDB: one embedded document, one `findById` = complete report.

### Why embed `questions[]` inside `Interview`?

Questions are NEVER needed independently of their interview. Embedding = one query, no joins. Tradeoff: can't query questions across interviews without aggregation pipelines — acceptable because that's not a current requirement.

### Why Firebase for Google OAuth but own JWT for sessions?

Firebase handles the complex OAuth2 dance (redirect URIs, token exchange, CSRF state). That's 3 lines vs implementing OAuth2 correctly from scratch (security-sensitive). But Firebase tokens are opaque to my backend. By issuing my own JWT after verifying the Firebase-provided email/name, I get ONE consistent session system — `verifyJWT` works identically regardless of login method.

### Why JWT in a cookie, not localStorage?

`httpOnly` cookies cannot be read by JavaScript. XSS attacks cannot steal the token. `localStorage` is readable by any script on the page including injected scripts. `secure:true` = HTTPS only. `sameSite:"None"` = required for cross-origin cookie sending (frontend/backend on different domains).

### Why OpenRouter instead of direct OpenAI/Gemini?

Provider-agnostic — one `askAI()` function, model swapped by changing one string. Free-tier model used during development (cost-effective for a student project). Commented-out alternatives in the service file show active experimentation. Tradeoff: thin proxy layer adds slight latency.

### Why deduct credits AFTER interview creation?

If the AI fails or DB write fails, the interview doesn't exist — user shouldn't be charged. Deducting only after successful `Interview.create()` ensures users pay only for interviews they actually receive.

### Why `asyncHandler` as a higher-order function?

```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
```

Without it: every controller needs its own try/catch + manual `next(err)`. With it: wrap once, any thrown error (including from `await`) automatically reaches the global error handler. Eliminates boilerplate across all 19 endpoints.

### Why services/ layer for external APIs?

Swap OpenRouter → OpenAI: change ONE file. Mock in tests: replace the service. Consistent errors: `askAI()` always throws `ApiError(500)` regardless of the underlying HTTP error shape. Controllers stay clean.

### Why Redux Toolkit + redux-persist AND Context API?

Different problems, different tools:
- Redux: auth state needed by many unrelated components, complex update patterns, dev tools
- Context: theme is a single boolean, infrequently changed, no action/reducer needed

Using the right tool for each problem rather than forcing one approach everywhere.

### Why fix the difficulty distribution instead of letting AI decide?

Consistency. Without explicit rules, one user might get 5 hard questions and another 5 easy — scores across sessions become incomparable. The fixed 2-2-1 distribution ensures every interview has the same "warm-up → challenge" shape, making progress tracking meaningful.

---

## 13. Known Issues & What I Would Improve

### High Priority

**1. Logout route mismatch**
`Sidebar.jsx` calls `POST /api/v1/user/logout`
Actual route: `POST /api/v1/auth/logout`
Result: 404 silently caught. UI looks logged out (Redux cleared). JWT cookie NEVER cleared server-side. Session valid for 7 more days.
Fix: Change one URL in `Sidebar.jsx`

**2. Non-atomic credit operation**
Credit check (`user.credits >= 20`) and deduction (`{$inc:{credits:-20}}`) are TWO separate operations.
Two simultaneous requests could both pass the check before either decrements (race condition).
Fix: `findOneAndUpdate({ _id:userId, credits:{$gte:20} }, { $inc:{credits:-20} }, { new:true })`
Returns null → insufficient credits (check + deduct in ONE atomic operation).

### Medium Priority

**3. Missing ownership check in `submitAnswer`**
`endInterview` checks `interview.userId === req.user._id`. `submitAnswer` does NOT.
Fix: Add the same check immediately after `Interview.findById()`

**4. `/register` and `/verify-otp` not rate-limited**
OTP = 6 digits (1,000,000 combinations). No rate limit = brute-force feasible in 10-min window.
Fix: Apply `authRateLimiter` to both endpoints

**5. `verifyJWT` wrong projection syntax**
`.select("__v")` = inclusion projection (returns ONLY `_id` + `__v`)
Intent: exclude sensitive fields
Fix: `.select("-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry -passwordHistory")`

### Low Priority

**6. AI computes `finalScore`**
Prompt asks AI to compute the average — LLMs occasionally miscalculate.
Fix: Remove finalScore from prompt. Backend: `Math.round((confidence + communication + correctness) / 3)`

**7. File size mismatch**
UI displays "Max 10MB". Multer backend limit is 5MB. No frontend size check.
Fix: Match limits + add frontend validation for instant feedback

**8. Integrity constants duplicated in 3 places**
Deduction values (-10/-8/-2/-5) hardcoded in `useIntegrity.js`, `IntegrityWarning.jsx`, `IntegrityReport.jsx`.
Fix: Extract to `constants/integrityRules.js`, import everywhere

**9. StatsCards includes incomplete interviews in average**
Incomplete interviews have `finalScore: 0` → drags down displayed average.
`PerformanceAnalytics` already filters to Completed — inconsistent.
Fix: `.filter(i => i.status === "Completed")` before averaging in `StatsCards`

**10. Leftover debug console.log statements**
In `IntegrityReport.jsx` and `AccountTab.jsx`.
Fix: Remove before production deploy

---

## 14. Future Roadmap

**Immediate bug fixes:**
- [ ] Fix logout URL (1 line)
- [ ] Atomic credit check+deduct
- [ ] Ownership check in `submitAnswer`
- [ ] Rate-limit `/register` + `/verify-otp`

**New Features:**
- [ ] Recruiter portal (shareable report links, candidate ranking)
- [ ] Admin panel (user management, AI cost monitoring)
- [ ] System Design interview mode
- [ ] Coding round mode (code execution via Judge0 API)
- [ ] Real-time / video interview sessions (WebRTC + Socket.IO)
- [ ] Subscription billing (Razorpay recurring)
- [ ] Notification preferences with actual email delivery

**Technical Improvements:**
- [ ] Queue-based AI processing (BullMQ + Redis) for concurrent scale
- [ ] React.lazy + Suspense for route-level code splitting
- [ ] `{userId:1, createdAt:-1}` indexes on Interview + Payment
- [ ] React Query / SWR for data caching
- [ ] Razorpay webhooks for server-side payment reliability
- [ ] Retry logic with exponential backoff for AI calls

---

## 15. Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Firebase project (Google Auth enabled)
- Razorpay account (test mode)
- OpenRouter API key
- Gmail + App Password (2FA → Google Account → Security → App Passwords)

### Installation

```bash
# Clone
git clone https://github.com/yourusername/Clevora-AI.git
cd Clevora-AI

# Backend
cd server
npm install
cp .env.sample .env
# fill in your values
npm run dev
# runs on http://localhost:8000

# Frontend (new terminal)
cd client
npm install
cp .env.sample .env
# fill in your values
npm run dev
# runs on http://localhost:5173
```

### Environment Variables

**`server/.env`**
```env
PORT=8000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT secret — keep private, change in production
JWT_SECRET=your_long_random_secret_here

# Frontend URL — used for CORS and password reset email links
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173

# OpenRouter — get from openrouter.ai
OPENROUTER_API_KEY=your_openrouter_api_key

# Razorpay — get from razorpay.com dashboard (test keys start with rzp_test_)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Gmail — use App Password (NOT your Gmail password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx
```

**`client/.env`**
```env
# Your backend URL
VITE_SERVER_URL=http://localhost:8000

# Firebase — get from Firebase Console → Project Settings → Your Apps → Web App
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 16. Interview Questions & Answers

### PROJECT OVERVIEW

**Q: Tell me about this project in 2 minutes.**
A: Clevora is an AI-powered mock interview platform I built on the MERN stack. The core idea is personalization — instead of generic question banks, it reads your actual resume, extracts your skills and projects using an LLM, and generates 5 difficulty-graded questions specific to your background. You answer by voice or text under a countdown timer. After each answer, an AI scores you on three axes: confidence, communication, and correctness. Scores are hidden during the session and revealed only in the final report. There's also an integrity system that tracks violations like tab-switching and copy-pasting. Monetization is credit-based — 100 free credits on signup, Razorpay for top-ups. The most technically interesting parts are the prompt engineering behind the AI evaluation, the integrity monitoring hook's refs-vs-state pattern, and the Razorpay double-verification payment security.

**Q: How many total AI calls per full interview session?**
A: Up to 7. One for resume parsing, one for question generation, and up to 5 for per-answer evaluation. Empty answers and timeouts skip the AI call and score 0 directly — saves cost and ensures consistent handling.

**Q: What's the most unique feature you built?**
A: The integrity monitoring system. It's a custom React hook tracking 4 violation types using browser event APIs — Page Visibility API for tab switches, paste events, contextmenu events, and keydown for shortcuts. The key engineering challenge was avoiding stale closures — event listeners registered once would always see the initial state value (0) unless I used `useRef` for the live counters. The hook's output matches the MongoDB schema exactly so it can be sent to the backend with zero transformation.

---

### ARCHITECTURE

**Q: Walk me through the architecture.**
A: Frontend is a React SPA (Vite), Redux Toolkit for auth state, Tailwind for styling. Communicates via axios with `withCredentials:true` — JWT cookie goes with every request. Backend is Express with a layered architecture — routes, controllers, services, models, middlewares, utils. Three MongoDB collections. External integrations: OpenRouter for AI, Razorpay for payments, Firebase for Google OAuth client-side, Nodemailer for emails. All AI calls go through one `askAI()` function — swap models by changing one string.

**Q: Why layered architecture?**
A: Separation of concerns. Routes are thin — just address books. Controllers have all business logic. Services wrap external APIs — if I switch from OpenRouter to direct OpenAI, I change one file. Models define data shapes. Utils are cross-cutting helpers. This makes each layer independently testable and maintainable.

---

### DATABASE

**Q: Why MongoDB and why embed questions inside interviews?**
A: MongoDB — interview data is hierarchical. Questions with 4 scores each, plus a nested integrity report with a variable violations array. In SQL this is 4+ tables with joins on every report fetch. In MongoDB it's one document, one query. Embedding — questions are never needed independently of their interview. They're always read and written together. One `findById` returns the complete report. The tradeoff is cross-interview question analytics would need aggregation pipelines — acceptable for the current use case.

**Q: How do you maintain data integrity without SQL foreign keys?**
A: Application-level. `deleteAccount` manually runs Interview.deleteMany → Payment.deleteMany → User.findByIdAndDelete in that order. MongoDB has no cascading deletes — the application is responsible. This is a common interview topic for NoSQL — you trade referential integrity guarantees for schema flexibility and query performance.

**Q: What indexes exist, and what would you add?**
A: Currently only `email` (via `unique: true`). I would add `{userId:1, createdAt:-1}` compound indexes on Interview and Payment — these match the exact query pattern of `getMyInterviews` and `getPaymentHistory` (filter by userId, sort by date). At current scale these are full collection scans per user — would become a serious bottleneck as the user base grows.

---

### AUTHENTICATION

**Q: Walk through the complete registration flow.**
A: Frontend validates (Gmail only, strong password, fields match). POST /register — backend validates again, checks existing users, creates the User (pre-save hook auto-hashes the password via bcrypt), generates a 6-digit OTP, SHA-256 hashes it before storing, emails the raw OTP, returns just the email. Frontend switches to OTP view. User submits OTP — backend SHA-256 hashes it, finds matching user with unexpired hash, sets isVerified=true, issues JWT in httpOnly cookie, returns user. Frontend dispatches to Redux, navigates home.

**Q: Why hash the OTP and reset token before storing?**
A: Defense in depth. If the database is compromised, the attacker has hashes — not the raw values needed to verify or reset. SHA-256 is one-way. The raw value only lives in the email, never persisted anywhere.

**Q: Tell me about a bug you found in your own code.**
A: The logout route mismatch. `Sidebar.jsx` calls `POST /api/v1/user/logout` but the actual route is `POST /api/v1/auth/logout`. The 404 is caught silently, so the UI looks logged out — Redux is cleared, user is redirected — but the JWT cookie is NEVER cleared server-side. The session technically remains valid for its full 7-day expiry. The fix is one URL change. I found this during deep code review — a good example of why end-to-end testing matters beyond just checking "does the UI update."

**Q: What is `authProvider: "both"` for?**
A: Handles users who use multiple login methods. If a Google-only user sets a password via "Forgot Password," `authProvider` upgrades from "google" to "both." If an email user logs in with Google using the same email, it upgrades from "email" to "both." They can then use either method without duplicate accounts.

---

### AI INTEGRATION

**Q: Explain the question generation prompt design.**
A: System message role-plays as a professional HR or Technical interviewer. Key rules: exactly 5 questions with a fixed difficulty distribution (2 easy/2 medium/1 hard), time limits mapped to difficulty (60/120/180s), questions specific to the candidate's actual skills and projects (not generic), calibrated to experience level, output must be ONLY a JSON array — no extra text, no markdown fences. User message contains the candidate's profile built from resume parsing.

**Q: Why fix the difficulty distribution instead of letting the AI decide?**
A: Consistency and comparability. Without rules, one user might get 5 hard questions and another 5 easy — scores become meaningless for tracking progress. The fixed distribution ensures every interview has the same warm-up → challenge shape, making improvement over sessions visible.

**Q: Why are scores hidden during the session?**
A: Prevents mid-interview strategy gaming — users would change approach based on scores, not reflect real interview behavior. Keeps UX focused on qualitative feedback (the feedback text shown immediately) rather than a discouraging running tally. Scores exist in DB after each submission but revealed only in the final report.

**Q: What if the AI returns malformed JSON?**
A: Code strips markdown fences before parsing (`replace(/```json|```/g, "")` — handles the common case of LLMs wrapping JSON despite instructions). If genuinely malformed, `JSON.parse` throws a SyntaxError caught by `asyncHandler`, returning 500. It's a known limitation — prompt engineering reduces but doesn't eliminate this risk. Better fix: dedicated try/catch with specific error message and retry with exponential backoff.

---

### PAYMENTS

**Q: Explain the double-verification.**
A: First, HMAC-SHA256 — recompute `HMAC(orderId|paymentId, secret)` and compare to the signature sent by the client. Proves payload wasn't tampered in transit. But doesn't prove the AMOUNT. A valid signature for ₹199 could be replayed against a ₹349 payment record. Second check — fetch payment directly from Razorpay's API, compare amounts in paise — closes that gap. Both must pass. This is the strongest security feature in the app.

**Q: What is idempotency and where do you use it?**
A: Calling an endpoint multiple times has the same effect as once. Used in `verifyPayment` (if `Payment.status === "paid"` → return early, don't double-credit) and `endInterview` (if `status === "Completed"` → return existing data, don't recompute scores). Prevents double-crediting from retried requests.

---

### REACT & FRONTEND

**Q: Why Redux AND Context API instead of just one?**
A: Different problems, different tools. `userData.credits` is needed by many unrelated components — Redux gives a centralized, predictable, debuggable update pattern. `redux-persist` makes it survive refreshes. Theme is one boolean, toggled rarely, no complex update patterns — Context is lighter, no action/reducer machinery needed.

**Q: Explain the stale closure problem and how you solved it in `useIntegrity`.**
A: Event listeners registered on mount capture initial variable values. State inside them never updates — always shows 0. In `useIntegrity`, paste/tab-switch handlers registered once would always see `count = 0` if I used useState. I use `useRef` for violation counters — refs are mutable objects, `.current` is always fresh inside any closure. State mirrors refs ONLY for UI re-renders (showing toasts). Refs = source of truth. State = display layer.

**Q: What is `redux-persist` and why?**
A: Automatically saves Redux state to localStorage and restores on load. Without it, refreshing clears Redux — user briefly sees logged-out state until `/current-user` resolves. With it, `userData` is instantly available from localStorage while session verification runs in the background.

---

### SECURITY

**Q: Why JWT in a cookie instead of localStorage?**
A: `httpOnly` cookies can't be read by JavaScript — XSS attacks can't steal the token. `localStorage` is readable by any script on the page. `secure:true` = HTTPS only. `sameSite:"None"` = required for cross-origin cookies (frontend/backend on different domains) — requires `secure:true` in modern browsers.

**Q: What would you improve about security?**
A: Five things in priority order: (1) Fix the logout URL — cookie never actually cleared. (2) Make credit check+deduct atomic via `findOneAndUpdate`. (3) Add ownership check in `submitAnswer`. (4) Rate-limit `/register` and `/verify-otp`. (5) Fix `verifyJWT`'s `.select("__v")` — it's an inclusion projection returning only `_id`+`__v`, should be excluding sensitive fields with `-` prefix.

---

### SYSTEM DESIGN

**Q: If 10,000 users took interviews simultaneously, what breaks first?**
A: The AI API. Each session has up to 7 LLM calls — at 10,000 concurrent sessions, that's 70,000 simultaneous AI calls. OpenRouter rate limits and latency would be the first failure point. Secondary: without `{userId:1,createdAt:-1}` indexes, dashboard queries become full collection scans. No caching means every dashboard refresh re-fetches the same data.

**Q: How would you scale the AI calls?**
A: Queue-based processing with BullMQ + Redis. Instead of synchronous AI calls in the request cycle, `/start` and `/submit-answer` enqueue AI jobs. Workers consume the queue independently — if one call takes 5 seconds, it doesn't block the API server or other requests. Workers scale horizontally. Frontend polls for completion or uses WebSockets for real-time updates. I've studied this as part of system design prep.

**Q: How would you add a recruiter portal?**
A: Add `role: "candidate|recruiter|admin"` to User. Create `ReportShare` collection: `{interviewId, sharedByUserId, accessToken, expiresAt}`. New endpoints: `POST /interview/:id/share` (generate share token), `GET /shared-report/:token` (public, token-gated). New `verifyShareToken` middleware. Frontend: "Share Report" button in ReportActions. No changes to existing interview flow.

---

## Author

**Aditya Singh**
B.Tech Electronics & Telecommunication Engineering — IET DAVV Indore (2023–2027)

[LinkedIn](https://www.linkedin.com/in/aditya-singh-6a4976277/)
