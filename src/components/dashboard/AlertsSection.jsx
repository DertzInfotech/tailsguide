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

      <PetList
        pets={pets}
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={onPageChange}
      />
    </div>
  );
}
