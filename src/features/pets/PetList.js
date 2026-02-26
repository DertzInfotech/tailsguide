'use client';

import PetCard from "@/features/pets/PetCard";

export default function PetList({
  pets,
  currentPage,
  totalPages,
  loading,
  onPageChange,
  hidePagination = false,
  hideFlyerAndSighting = false,
  showFooterText = true,
  cardSize = "normal",
  emptyTitle = "No active alerts right now",
  emptyDescription = "That's good news. Your community is safe — we'll notify you instantly if something changes."
}) {

  if (loading) {
    return (
      <div className="space-y-4 mt-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-white/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!loading && pets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">🐾</div>
        <h3 className="text-lg font-semibold text-white">
          {emptyTitle}
        </h3>
        <p className="text-sm text-white/90 max-w-xs mx-auto mt-1">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Card list */}
      <div className="flex flex-col flex-1 min-h-0">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            imageUrl={`/api/v1/pet/${pet.id}/thumbnail`}
            hideFlyerAndSighting={hideFlyerAndSighting}
            cardSize={cardSize}
          />
        ))}
      </div>

      {showFooterText && (
        <p className="text-xs text-white/90 text-center mt-4 shrink-0">
          Showing community alerts in real time
        </p>
      )}

      {/* Pagination */}
      {!hidePagination && (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
            border border-gray-300 text-gray-700 hover:bg-orange-primary hover:text-white
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === 0}
          onClick={() => onPageChange((p) => Math.max(0, p - 1))}
        >
          ← Prev
        </button>

        <span className="text-sm font-medium text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
            border border-gray-300 text-gray-700 hover:bg-orange-primary hover:text-white
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage + 1 >= totalPages}
          onClick={() => onPageChange((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next →
        </button>
      </div>)}
    </div>
  );
}
