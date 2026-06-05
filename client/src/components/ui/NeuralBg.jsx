import { useTheme } from "../../context/ThemeContext.jsx";
import { useCursorGlow } from "../../hooks/useCursorGlow.js";

export function NeuralBg() {
  const { dark } = useTheme();
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute w-[900px] h-[900px] rounded-full -top-72 -left-64"
        style={{
          background: dark
            ? "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full -bottom-56 -right-48"
        style={{
          background: dark
            ? "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: dark
            ? "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)"
            : "transparent",
        }}
      />
      {dark && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.018,
            backgroundImage:
              "linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}
    </div>
  );
}

export function CursorGlow() {
  const pos = useCursorGlow();
  return (
    <div
      className="pointer-events-none fixed inset-0 hidden lg:block"
      style={{
        zIndex: 1,
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.06), transparent 40%)`,
      }}
    />
  );
}
