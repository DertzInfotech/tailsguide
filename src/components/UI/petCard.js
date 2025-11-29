'use client'

import { useState, useEffect } from "react";

export default function PetCard({ pet }) {
  const daysMissing = Math.floor(
    (new Date() - new Date(pet.lastSeenDate)) / (1000 * 60 * 60 * 24)
  );

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://tailsguide-production-53f0.up.railway.app/api/v1/pet/${pet.id}/thumbnail`);
        const thumbnail = await response.blob();
        const imageurl = URL.createObjectURL(thumbnail);
        setImg(imageurl);
      } catch (error) {
        console.log("Error getting thumbnail", error);
      }
    };

    if(pet.id) {
      fetchThumbnail();
    }

    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    }
  }, [pet.id]);

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border-2 mb-4 transition
        ${pet.reportType === "LOST" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}
      `}
    >
      {/* Thumbnail */}
      <img
        src={img}
        alt={pet.petName}
        className="w-20 h-20 rounded-md object-cover"
      />

      {/* Info Section */}
      <div className="flex-1">
        <h4 className="text-gray-800 mb-2 font-semibold text-lg">
          {pet.petName || "Unknown"}
        </h4>

        <p className="text-gray-600 text-sm mb-1">
          <i className="fas fa-map-marker-alt mr-1"></i>
          {pet.lastSeenLocation}
        </p>

        <p className="text-gray-600 text-sm">
          <i className="fas fa-clock mr-1"></i>
          {pet.reportType === "LOST"
            ? `Missing for ${daysMissing} days`
            : `Found ${daysMissing} days ago`}
        </p>

        {/* Tags */}
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            Medical Needs
          </span>

          <span
            className={`
              px-2 py-1 rounded text-xs
              ${pet.reportType === "LOST"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"}
            `}
          >
            {pet.reportType}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => onDownload(pet.id)}
        className="
          bg-orange-500 hover:bg-orange-600 text-white
          px-3 py-1 rounded-md text-sm
        "
      >
        Download Flyer
      </button>
    </div>
  );
}

// Flyer download logic
async function onDownload(petId) {
  try {
    const response = await fetch(
      `https://tailsguide-production-53f0.up.railway.app/api/v1/pet/${petId}/flyer-pdf`
    );

    const blob = await response.blob();

    if (response.ok) {
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `flyer-pet-${petId}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error("Error downloading flyer:", err);
  }
}