'use client';

import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, label }) {
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

  return (
    <div className="text-center mb-6">
      <div className="text-4xl font-extrabold text-emerald-600">
        {count.toLocaleString()}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
}
