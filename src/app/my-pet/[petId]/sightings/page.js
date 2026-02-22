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
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center p-6">
        <p className="text-amber-800">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/my-pet"
            className="text-sm text-amber-700 hover:underline font-medium"
          >
            ← Back to My Pets
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Someone spotted your pet
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          {pet?.petName
            ? `Sighting reports for ${pet.petName}. Contact the person below to follow up.`
            : "Sighting reports for this pet. Contact the person below to follow up."}
        </p>

        {/* Mark found - only show when pet is currently LOST */}
        {pet?.reportType === "LOST" && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMarkFound}
              disabled={markingFound}
              className="px-5 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {markingFound ? "Updating…" : "Mark found"}
            </button>
            {markFoundMessage && (
              <span className={`text-sm ${markFoundMessage.includes("Failed") ? "text-red-600" : "text-emerald-700"}`}>
                {markFoundMessage}
              </span>
            )}
          </div>
        )}

        {sightings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow border border-amber-100 p-8 text-center text-gray-500">
            No sighting reports yet. When someone reports that they saw your pet, they will appear here.
          </div>
        ) : (
          <ul className="space-y-4">
            {sightings.map((s, i) => (
              <li
                key={s.id ?? i}
                className="bg-white rounded-2xl shadow border border-amber-100 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    Report #{i + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatSightingTime(s.sightingTime)}
                  </span>
                </div>
                <dl className="grid gap-2 text-sm">
                  <div>
                    <dt className="text-gray-500 font-medium">Name</dt>
                    <dd className="text-gray-800">{s.sighterName || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 font-medium">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${s.sighterPhone || ""}`}
                        className="text-amber-600 hover:underline font-medium"
                      >
                        {s.sighterPhone || "—"}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 font-medium">Location</dt>
                    <dd className="text-gray-800">{s.location || "—"}</dd>
                  </div>
                  {s.description && (
                    <div>
                      <dt className="text-gray-500 font-medium">Details</dt>
                      <dd className="text-gray-800">{s.description}</dd>
                    </div>
                  )}
                </dl>
                {s.id != null && (
                  <div className="mt-4 pt-3 border-t border-amber-100">
                    <a
                      href={`/api/v1/pet/sightings/${s.id}/photo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-amber-600 hover:underline"
                    >
                      View photo →
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
