import { useTheme } from "../../context/ThemeContext.jsx";
import { features } from "../../data/features.js";
import FadeIn from "../ui/FadeIn.jsx";
import FeatureCard from "../ui/FeatureCard.jsx";

export default function FeaturesSection() {
  const { dark } = useTheme();

  return (
    <section id="features" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[2.5px]">
            Everything you need
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-4 ${dark ? "text-white" : "text-slate-900"}`}
          >
            Built for serious{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              interview prep
            </span>
          </h2>
          <p
            className={`max-w-xl mx-auto text-base ${dark ? "text-slate-400" : "text-slate-600"}`}
          >
            Not another question bank. A complete AI interview coach that adapts
            to YOUR resume and delivers real, actionable feedback.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <FeatureCard {...f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
