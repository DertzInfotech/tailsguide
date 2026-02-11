'use client';

export default function StatsOverview({ activeAlertsCount }) {
  const cards = [
    {
      label: "Active Alerts",
      number: activeAlertsCount,
    },
    {
      label: "Partner Shelters",
      number: 89,
    },
    {
      label: "Active Volunteers",
      number: 1234,
    },
    {
      label: "Success Rate",
      number: "87%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="group relative isolate rounded-2xl p-4 sm:p-5 lg:p-7 text-center
          bg-[#fee3b9]
          transition-all duration-300 ease-out
          hover:-translate-y-1
          hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
        >
          <div
            className="text-4xl font-bold mb-1"
            style={{ color: "var(--deep-orange)" }}
          >
            {card.number}
          </div>
          <div
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
