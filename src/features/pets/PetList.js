'use client'

import { useEffect, useState } from "react";
import PetCard from "@/features/pets/PetCard";

export default function PetList({ pets, currentPage, totalPages, loading, onPageChange }) {
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const loadThumbnails = async () => {
      const entries = await Promise.all(
        pets.map(async (pet) => {
          try {
            const response = await fetch(
              `https://tailsguide-production-53f0.up.railway.app/api/v1/pet/${pet.id}/thumbnail`
            );
            const blob = await response.blob();
            return [pet.id, URL.createObjectURL(blob)];
          } catch (err) {
            console.error("Thumbnail fetch failed for pet", pet.id);
            return [pet.id, null];
          }
        })
      );

      setThumbnails(Object.fromEntries(entries));
    };

    if (pets && pets.length > 0) {
      loadThumbnails();
    }

    return () => {
      Object.values(thumbnails).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [pets]);

  if (loading) {
    return (
      <div className="space-y-4 mt-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (!loading && pets.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-semibold text-gray-800">
          No active alerts right now
        </h3>
        <p className="text-sm text-gray-500">
          That’s good news! We’ll notify you if something appears.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Card list */}
      <div className="flex flex-col">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} imageUrl={thumbnails[pet.id]} />
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Showing community alerts in real time </p>

      {/* Pagination */}
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
      </div>
    </div>
  );
}
