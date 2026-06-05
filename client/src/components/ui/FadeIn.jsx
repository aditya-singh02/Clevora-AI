import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.65,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const initial =
    direction === "up"
      ? { opacity: 0, y: 32 }
      : direction === "down"
        ? { opacity: 0, y: -32 }
        : direction === "left"
          ? { opacity: 0, x: -32 }
          : direction === "right"
            ? { opacity: 0, x: 32 }
            : { opacity: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
