import { BsStarFill } from "react-icons/bs";

export default function TestimonialCard({
  name,
  role,
  company,
  avatar,
  color,
  rating,
  text,
}) {
  return (
    <div
      className="w-72 flex-shrink-0 p-5 rounded-2xl flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <BsStarFill key={i} size={11} className="text-amber-400" />
        ))}
      </div>

      {/* Review text */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1">"{text}"</p>

      {/* User info */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
        >
          {avatar}
        </div>
        <div>
          <div className="text-sm font-semibold text-white leading-tight">
            {name}
          </div>
          <div className="text-xs text-slate-500">
            {role} · {company}
          </div>
        </div>
      </div>
    </div>
  );
}
