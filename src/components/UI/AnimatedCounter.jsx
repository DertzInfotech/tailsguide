'use client';

import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, label, variant = "default" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const increment = Math.ceil(value / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const isLight = variant === "light";
  return (
    <div className="text-center mb-0">
      <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${isLight ? "text-white" : "text-amber-900"}`}>
        {count.toLocaleString()}
      </div>
      <p className={`text-sm mt-1 ${isLight ? "text-white/90" : "text-amber-800/80"}`}>
        {label}
      </p>
    </div>
  );
}
