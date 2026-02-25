"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPetById, getPetSightings, markPetFound } from "@/api/petApi";

function formatSightingTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/** Cat (left) & dog (right) - background images */
const CAT_BG_IMG = "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&q=80";
const DOG_BG_IMG = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80";

function HappyDogBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-0 w-[28%] min-w-[160px] max-w-[260px] opacity-[0.22] sm:opacity-[0.26]">
        <img
          src={CAT_BG_IMG}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-[28%] min-w-[160px] max-w-[260px] opacity-[0.22] sm:opacity-[0.26]">
        <img
          src={DOG_BG_IMG}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}

export default function PetSightingsPage() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingFound, setMarkingFound] = useState(false);
  const [markFoundMessage, setMarkFoundMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [petRes, sightRes] = await Promise.all([
          getPetById(petId),
          getPetSightings(petId),
        ]);
        if (cancelled) return;
        setPet(petRes.data);
        const data = sightRes.data;
        const list = Array.isArray(data)
          ? data
          : data?.content
            ? data.content
            : data?.sightings
              ? data.sightings
              : [];
        setSightings(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setSightings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [petId]);

  const handleMarkFound = async () => {
    if (!petId || !pet) return;
    setMarkFoundMessage(null);
    setMarkingFound(true);
    try {
      await markPetFound(petId);
      setPet((prev) => (prev ? { ...prev, reportType: "FOUND" } : null));
      setMarkFoundMessage("Pet has been marked as found.");
    } catch (err) {
      console.error(err);
      setMarkFoundMessage(err.response?.data?.message || "Failed to mark as found. Please try again.");
    } finally {
      setMarkingFound(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50/80 to-orange-50/50 flex items-center justify-center p-6">
        <p className="text-amber-800 font-medium">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/90 via-[#fefaf5] to-orange-50/40 py-8 px-4 sm:py-10 relative overflow-hidden">
      <HappyDogBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          href="/my-pet"
          className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium mb-8 transition-colors"
        >
          <span aria-hidden>←</span> Back to My Pets
        </Link>

        {/* Hero block */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Someone spotted your pet
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg">
            {pet?.petName
              ? `Sighting reports for ${pet.petName}. Contact the person below to follow up.`
              : "Sighting reports for this pet. Contact the person below to follow up."}
          </p>
        </div>

        {/* Mark found */}
        {pet?.reportType === "LOST" && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMarkFound}
              disabled={markingFound}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white
                bg-linear-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
                shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span aria-hidden>✓</span>
              {markingFound ? "Updating…" : "Mark found"}
            </button>
            {markFoundMessage && (
              <span className={`text-sm font-medium ${markFoundMessage.includes("Failed") ? "text-red-600" : "text-emerald-700"}`}>
                {markFoundMessage}
              </span>
            )}
          </div>
        )}

        {sightings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100/80 p-8 sm:p-10 text-center">
            <p className="text-5xl mb-3" aria-hidden>👀</p>
            <p className="text-gray-600 font-medium">No sighting reports yet</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              When someone reports that they saw your pet, they will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {sightings.map((s, i) => (
              <li
                key={s.id ?? i}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-100/80 p-5 sm:p-6
                  hover:shadow-lg hover:border-amber-200/60 transition-all duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wide">
                    Report #{i + 1}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatSightingTime(s.sightingTime)}
                  </span>
                </div>
                <dl className="grid gap-3 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500 font-medium shrink-0">Name</dt>
                    <dd className="text-gray-800">{s.sighterName || "—"}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500 font-medium shrink-0">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${s.sighterPhone || ""}`}
                        className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors"
                      >
                        {s.sighterPhone || "—"}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500 font-medium shrink-0">Location</dt>
                    <dd className="text-gray-800">{s.location || "—"}</dd>
                  </div>
                  {s.description && (
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-gray-500 font-medium shrink-0">Details</dt>
                      <dd className="text-gray-800">{s.description}</dd>
                    </div>
                  )}
                </dl>
                {s.id != null && (
                  <div className="mt-4 pt-4 border-t border-amber-100/80">
                    <a
                      href={`/api/v1/pet/sightings/${s.id}/photo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      View photo
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
