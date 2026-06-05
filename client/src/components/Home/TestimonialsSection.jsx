import { motion } from "framer-motion";
import { useState } from "react";
import { testimonials } from "../../data/testimonials.js";
import FadeIn from "../ui/FadeIn.jsx";
import TestimonialCard from "../ui/TestimonialCard.jsx";

// Duplicate for seamless infinite loop
const doubled = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative z-10 py-20">
      <FadeIn className="text-center mb-12 px-5">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-[2.5px]">
          Real stories
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 text-white">
          They cracked it.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            You can too.
          </span>
        </h2>
      </FadeIn>

      {/* Marquee */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #030712, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #030712, transparent)",
          }}
        />

        <motion.div
          animate={
            paused ? { x: 0 } : { x: [0, -((doubled.length / 2) * 308)] }
          }
          transition={
            paused ? {} : { duration: 40, repeat: Infinity, ease: "linear" }
          }
          className="flex gap-5 pb-4"
          style={{ width: "max-content" }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </motion.div>
      </div>

      <p className="text-center text-xs text-slate-700 mt-6">
        Hover to pause · Auto-scrolling testimonials
      </p>
    </section>
  );
}
