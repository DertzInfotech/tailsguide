'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import PetList from "@/features/pets/PetList";

export default function AlertsSection({
  pets,
  currentPage,
  totalPages,
  loading,
  onPageChange
}) {
  const mockAlerts = [
    { id: 1, name: "Buddy", type: "Dog", location: "Indiranagar, Bengaluru", time: "2h ago" },
    { id: 2, name: "Milo", type: "Cat", location: "Andheri West, Mumbai", time: "5h ago" },
    { id: 3, name: "Luna", type: "Dog", location: "Sector 62, Noida", time: "Yesterday" },
  ];

  return (
    <div
      className="rounded-2xl p-5 sm:p-7 glass-card orange-card
  transition-all duration-300 ease-out
  hover:-translate-y-1"
    >

      <div className="flex items-center gap-4 mb-2">
        <FontAwesomeIcon
          icon={faBell}
          className="text-2xl"

        />
        <h2
          className="text-2xl font-extrabold tracking-tight"

        >
          Active Alerts
        </h2>
      </div>
      <p
        className="text-sm mb-5"

      >
        Real-time reports from the community
      </p>

      {!loading && pets.length === 0 ? (
        <div
          className="relative h-48 overflow-hidden scroll-pause"
          onTouchStart={(e) => {
            e.currentTarget
              .querySelector('.animate-scroll-y')
              ?.classList.add('scroll-paused');
          }}
          onTouchEnd={(e) => {
            e.currentTarget
              .querySelector('.animate-scroll-y')
              ?.classList.remove('scroll-paused');
          }}
        >
          <div className="absolute inset-0 animate-scroll-y">
            {[...mockAlerts, ...mockAlerts].map((alert, idx) => (
              <div
                key={idx}
                className="bg-[#ff4d00] rounded-xl p-4 mb-3 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {alert.name} · {alert.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last seen in {alert.location}
                  </p>
                </div>
                <span className="text-xs font-medium text-orange-300">
                  {alert.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <PetList
          pets={pets}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={onPageChange}
        />
      )}

    </div>
  );
}
