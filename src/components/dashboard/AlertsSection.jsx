'use client';

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
      className="
        relative overflow-hidden
        rounded-2xl p-5 sm:p-7
        glass-card orange-card
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* 🔴 Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Icon with pulse */}
          <div className="relative">
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
            <FontAwesomeIcon
              icon={faBell}
              className="text-2xl text-red-500"
            />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Active Alerts
            </h2>
            <p className="text-sm opacity-80">
              Real-time reports from the community
            </p>
          </div>
        </div>

        {/* LIVE badge */}
        <span className="
          flex items-center gap-2
          rounded-full px-3 py-1
          text-xs font-semibold
          bg-red-500/15 text-red-600
        ">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* 🔑 SCROLL AREA – ONLY ALERT CARDS */}
      <div className="alerts-scroll relative space-y-3">
        <PetList
          pets={pets}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={onPageChange}
          hidePagination
        />
      </div>
    </div>
  );
}
