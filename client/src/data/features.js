import { FaRegFileAlt } from 'react-icons/fa'
import { TbBrain, TbMicrophone2, TbShieldCheck, TbReportAnalytics } from 'react-icons/tb'
import { BsGraphUpArrow } from 'react-icons/bs'

export const features = [
    { icon: FaRegFileAlt, title: 'Resume-Based Questions', desc: 'AI reads YOUR actual resume and generates questions about your specific skills and projects. Zero generic questions.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', glow: 'rgba(59,130,246,0.12)' },
    { icon: TbMicrophone2, title: 'Real Voice Interview', desc: 'Speak your answers. AI listens, transcribes, and evaluates in real-time. Feels exactly like the real thing.', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', glow: 'rgba(139,92,246,0.12)' },
    { icon: TbBrain, title: 'Instant AI Feedback', desc: 'Scored on correctness, confidence and communication after every answer. Know exactly what to improve.', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', glow: 'rgba(6,182,212,0.12)' },
    { icon: TbReportAnalytics, title: 'Detailed Score Report', desc: 'Full breakdown with per-question analysis, strengths, weaknesses and what to do next.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', glow: 'rgba(16,185,129,0.12)' },
    { icon: TbShieldCheck, title: 'Integrity Monitoring', desc: 'Built-in proctoring: tab switches, copy attempts, focus tracking. Get an Integrity Score every session.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', glow: 'rgba(245,158,11,0.12)' },
    { icon: BsGraphUpArrow, title: 'Progress Tracking', desc: 'Track improvement across multiple interviews. See how your scores evolve before placement season.', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', glow: 'rgba(244,63,94,0.12)' },
]