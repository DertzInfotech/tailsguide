'use client'

import { useState } from "react";

export default function PetCard({ pet, imageUrl }) {
  const [loading, setLoading] = useState(false);

  const daysMissing = Math.floor(
    (new Date() - new Date(pet.lastSeenDate)) / (1000 * 60 * 60 * 24)
  );

  const FLYER_URL = `http://64.225.84.126:8084/api/v1/pet/${pet.id}/flyer-pdf`;

  const isLost = pet.reportType === "LOST";
  const isRecentlyFound = !isLost && daysMissing <= 3;

  return (
    <div
      className={`
        group relative overflow-hidden
        flex gap-4 p-4 mb-4 rounded-xl
        border transition-all duration-300
        ${isLost
          ? "border-red-500/40 bg-red-50/60"
          : "border-emerald-500/40 bg-emerald-50/60"}
        ${isRecentlyFound
          ? "ring-2 ring-emerald-400/60 shadow-emerald-500/30"
          : ""}
        hover:shadow-xl
      `}
    >
      {/* Status strip */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          isLost ? "bg-red-500" : "bg-emerald-500"
        }`}
      />

      {/* Image + badge */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={imageUrl}
            alt={pet.petName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/dog-default.png";
            }}
          />
        </div>

        <span
          className={`
            absolute -bottom-2 -right-2
            px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-md
            ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}
          `}
        >
          {pet.reportType}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h4 className="font-semibold text-gray-900 truncate">
            {pet.petName || "Unknown"}
          </h4>

          <span className="text-xs px-2 py-1 rounded-full bg-black/5">
            {isLost ? `${daysMissing}d missing` : `${daysMissing}d ago`}
          </span>
        </div>

        <p className="text-sm text-gray-600 truncate mt-1">
          📍 {pet.lastSeenLocation}
        </p>

        {isRecentlyFound && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
            Recently Found 🎉
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 justify-center">
        <button
          disabled={loading}
          onClick={() => downloadFlyer(FLYER_URL, pet.id, setLoading)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium text-white
            ${loading
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"}
          `}
        >
          {loading ? "Downloading…" : "Flyer"}
        </button>

        <button
          onClick={() => previewFlyer(FLYER_URL)}
          className="text-xs text-orange-600 hover:underline"
        >
          Preview
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

async function downloadFlyer(url, petId, setLoading) {
  try {
    setLoading(true);
    const res = await fetch(url);
    const blob = await res.blob();
    const fileUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `flyer-pet-${petId}.pdf`;
    a.click();
    URL.revokeObjectURL(fileUrl);
  } catch {
    alert("Unable to download flyer.");
  } finally {
    setLoading(false);
  }
}

async function previewFlyer(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    window.open(URL.createObjectURL(blob), "_blank");
  } catch {
    alert("Unable to preview flyer.");
  }
}
