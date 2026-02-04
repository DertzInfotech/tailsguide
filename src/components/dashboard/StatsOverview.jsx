'use client'

import { statsCardsInfo } from "@/app/info";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCardsInfo.map((card, i) => (
        <div
          key={i}
          className="group relative isolate rounded-2xl p-4 sm:p-5 lg:p-7 text-center
  bg-[#fee3b9]
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)]"

        >
          <div
            className="mb-4
  transition-transform duration-300 ease-out
  motion-safe:group-hover:scale-[1.08]"
            style={{ color: "var(--amber)" }}
          >
            {card.icon}
          </div>
          <div
            className="text-4xl font-bold mb-1
  transition-transform duration-300 ease-out
  motion-safe:group-hover:-translate-y-0.5"
            style={{ color: "var(--deep-orange)" }}
          >
            {card.number}
          </div>
          <div
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {card.label}</div>
        </div>
      ))}
    </div>
  );
}
