'use client'

import PetCard from "./petCard";

export default function PetList({ pets, currentPage, totalPages, loading, onPageChange }) {

  if (loading) return <p className="mt-5 font-semibold text-gray-700 text-lg">Loading...</p>;

  return (
    <div>
      {/* Card list */}
      <div className="flex flex-col">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-base font-medium 
                    bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => onPageChange((p) => p - 1)}
        >
          Prev
        </button>

        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-base font-medium 
                    bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
