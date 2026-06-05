import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

function AnimatedNumber({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.round(target * (step / steps)));
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    label: "Interviews Conducted",
    target: 50000,
    suffix: "+",
    display: "K+",
    divisor: 1000,
  },
  {
    label: "Active Users",
    target: 12000,
    suffix: "+",
    display: "K+",
    divisor: 1000,
  },
  {
    label: "Companies Cracked",
    target: 200,
    suffix: "+",
    display: "+",
    divisor: 1,
  },
  {
    label: "Avg Score Improvement",
    target: 40,
    suffix: "%",
    display: "%",
    divisor: 1,
  },
];

export default function StatsSection() {
  const { dark } = useTheme();

  return (
    <section
      className={`relative z-10 py-16 border-y ${dark ? "border-white/[0.05]" : "border-slate-200"}`}
    >
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true });
            const [count, setCount] = useState(0);

            useEffect(() => {
              if (!inView) return;
              const steps = 60;
              let step = 0;
              const t = setInterval(() => {
                step++;
                setCount(Math.round((s.target / s.divisor) * (step / steps)));
                if (step >= steps) clearInterval(t);
              }, 2000 / steps);
              return () => clearInterval(t);
            }, [inView]);

            return (
              <div key={s.label} ref={ref}>
                <div
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-1 ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {count}
                  {s.display}
                </div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
