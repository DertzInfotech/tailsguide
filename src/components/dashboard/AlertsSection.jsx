'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import PetList from "@/features/pets/PetList";
import CartoonCardPet from "@/components/dashboard/CartoonCardPet";

export default function AlertsSection({
  pets,
  currentPage,
  totalPages,
  loading,
  onPageChange
}) {
  return (
    <div className="dashboard-section-card p-6 sm:p-8 relative">
      {/* Cartoon pet - alerts (alert cat), left side */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-0 opacity-90">
        <CartoonCardPet variant="alerts" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 dashboard-section-header-divider border-b relative z-10 pl-20 sm:pl-24">
        <div className="flex items-center gap-4">
          <div className="dashboard-section-icon-wrap relative flex items-center justify-center w-12 h-12 rounded-2xl text-white">
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse ring-2 ring-white/80" />
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Active Alerts
            </h2>
            <p className="text-sm text-white/95 mt-1 opacity-95">
              Real-time reports from the community
            </p>
          </div>
        </div>
        <span className="dashboard-section-badge flex items-center gap-2 px-3.5 py-2 text-xs text-white shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="alerts-scroll relative mt-5 pt-1">
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
