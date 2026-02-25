"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMyPets, getPetMedicalRecords, getPetMedicalDocument } from "@/api/petApi";

/** Same completeness check as My Pets page */
function getMissingProfileFields(pet) {
  if (!pet) return [];
  const missing = [];
  if (!pet.petName) missing.push("Pet name");
  if (!pet.breed) missing.push("Breed");
  if (!pet.gender) missing.push("Gender");
  if (!pet.size) missing.push("Size");
  if (!pet.primaryColor) missing.push("Color");
  if (!pet.distinctiveFeatures) missing.push("Distinctive marks");
  if (!pet.lastSeenLocation) missing.push("Location");
  if (!pet.ownerName) missing.push("Owner name");
  if (!pet.ownerPhone) missing.push("Phone number");
  return missing;
}

/** Cat (left) & dog (right) - background images */
const CAT_BG_IMG = "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&q=80";
const DOG_BG_IMG = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80";

function PetProfileBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-0 w-[28%] min-w-[160px] max-w-[260px] opacity-[0.22] sm:opacity-[0.26]">
        <img src={CAT_BG_IMG} alt="" className="w-full h-full object-cover object-center" />
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-[28%] min-w-[160px] max-w-[260px] opacity-[0.22] sm:opacity-[0.26]">
        <img src={DOG_BG_IMG} alt="" className="w-full h-full object-cover object-center" />
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-100/80 p-5 sm:p-6 hover:shadow-lg hover:border-amber-200/60 transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden>{icon}</span>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  const v = value != null && String(value).trim() !== "" ? String(value).trim() : null;
  return (
    <div className="flex flex-wrap gap-x-2 py-2 border-b border-amber-50 last:border-0">
      <dt className="text-gray-500 font-medium shrink-0 min-w-[100px]">{label}</dt>
      <dd className="text-gray-800">{v || "—"}</dd>
    </div>
  );
}

function formatDate(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return str;
  }
}

export default function PetProfilePage() {
  const { petId } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalLoading, setMedicalLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await getMyPets();
        if (cancelled) return;
        const found = (res.data || []).find((p) => String(p.id) === String(petId));
        if (!found) {
          router.replace("/my-pet");
          return;
        }
        setPet(found);
      } catch {
        if (!cancelled) router.replace("/my-pet");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [petId, router]);

  const openMedicalModal = async () => {
    setShowMedicalModal(true);
    setMedicalLoading(true);
    setMedicalRecords([]);
    try {
      const res = await getPetMedicalRecords(petId);
      setMedicalRecords(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMedicalRecords([]);
    } finally {
      setMedicalLoading(false);
    }
  };

  const handleViewDocument = async (recordId) => {
    try {
      const res = await getPetMedicalDocument(recordId);
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      // ignore
    }
  };

  const handleDownloadDocument = async (recordId) => {
    try {
      const res = await getPetMedicalDocument(recordId);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-document-${recordId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50/80 to-orange-50/50 flex items-center justify-center p-6">
        <p className="text-amber-800 font-medium">Loading…</p>
      </div>
    );
  }

  if (!pet) return null;

  const missing = getMissingProfileFields(pet);
  const isComplete = missing.length === 0;
  const isLost = pet.reportType === "LOST";
  const thumbnailUrl = pet.thumbnailUrl
    ? `/api/v1${pet.thumbnailUrl.startsWith("/") ? pet.thumbnailUrl : `/${pet.thumbnailUrl}`}?ts=${pet.updatedAt || Date.now()}`
    : `/api/v1/pet/${pet.id}/thumbnail?ts=${pet.updatedAt || Date.now()}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/90 via-[#fefaf5] to-orange-50/40 py-8 px-4 sm:py-10 relative overflow-hidden">
      <PetProfileBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          href="/my-pet"
          className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium mb-8 transition-colors"
        >
          <span aria-hidden>←</span> Back to My Pets
        </Link>

        {/* Hero */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100/80 overflow-hidden">
            <div className="aspect-4/5 sm:aspect-3/2 relative bg-linear-to-br from-amber-100 to-orange-100">
              {/* Fallback only when image fails - behind photo so it never overlays */}
              <span className="absolute inset-0 flex items-center justify-center text-6xl text-amber-200/70 z-0" aria-hidden>🐕</span>
              <img
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => e.currentTarget.classList.add("hidden")}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                    isLost ? "bg-amber-500/95 text-white" : "bg-emerald-500/95 text-white"
                  }`}
                >
                  {isLost ? "Lost" : "Found"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-2 drop-shadow-md">{pet.petName || "Unnamed"}</h1>
                <p className="text-white/95 text-sm mt-0.5">{pet.breed || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Missing details CTA */}
        {!isComplete && (
          <div className="mb-8 bg-amber-500/15 border border-amber-400/50 rounded-2xl p-5 sm:p-6">
            <p className="text-amber-900 font-semibold mb-1">Some details are missing</p>
            <p className="text-amber-800/90 text-sm mb-4">
              Add {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` and ${missing.length - 3} more` : ""} so your pet&apos;s profile is complete.
            </p>
            <Link
              href={`/edit-pet/${pet.id}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
            >
              <span aria-hidden>✏️</span> Edit to add details
            </Link>
          </div>
        )}

        {/* Basic details */}
        <div className="space-y-6">
          <SectionCard title="Basic details" icon="🐾">
            <dl className="text-sm">
              <Field label="Age" value={pet.age} />
              <Field label="Gender" value={pet.gender} />
              <Field label="Size" value={pet.size} />
              <Field label="Color" value={pet.primaryColor} />
              <Field label="Distinctive marks" value={pet.distinctiveFeatures} />
            </dl>
          </SectionCard>

          {(pet.reportType === "LOST" || pet.lastSeenLocation || pet.lastSeenDate) && (
            <SectionCard title={isLost ? "Last seen" : "Found details"} icon="📍">
              <dl className="text-sm">
                <Field label="Location" value={pet.lastSeenLocation} />
                <Field label="Date" value={pet.lastSeenDate} />
                <Field label="Time" value={pet.lastSeenTime} />
                {isLost && <Field label="Circumstances" value={pet.circumstances} />}
              </dl>
            </SectionCard>
          )}

          <SectionCard title="Contact" icon="📞">
            <dl className="text-sm">
              <Field label="Owner" value={pet.ownerName} />
              <Field label="Phone" value={pet.ownerPhone} />
              <Field label="Email" value={pet.ownerEmail} />
              <Field label="Emergency contact" value={pet.emergencyContact} />
            </dl>
          </SectionCard>

          {(pet.microchipId || pet.medicalConditions || pet.specialInstructions) && (
            <SectionCard title="Medical & ID" icon="🩺">
              <dl className="text-sm">
                <Field label="Microchip ID" value={pet.microchipId} />
                <Field label="Medical conditions" value={pet.medicalConditions} />
                <Field label="Special instructions" value={pet.specialInstructions} />
              </dl>
            </SectionCard>
          )}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/edit-pet/${pet.id}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-amber-800 bg-white border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-sm transition-all"
          >
            <span aria-hidden>✏️</span> Edit profile
          </Link>
          <button
            type="button"
            onClick={openMedicalModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-amber-700 bg-amber-100/80 hover:bg-amber-200/80 transition-all"
          >
            <span aria-hidden>📋</span> Medical records
          </button>
          {isLost && (
            <Link
              href={`/my-pet/${pet.id}/sightings`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-linear-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md transition-all"
            >
              <span aria-hidden>👀</span> Sightings
            </Link>
          )}
        </div>
      </div>

      {/* Medical records popup */}
      {showMedicalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowMedicalModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-100/80 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-amber-100">
              <h2 className="text-xl font-bold text-gray-800">Medical records</h2>
              <button
                type="button"
                onClick={() => setShowMedicalModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {medicalLoading ? (
                <p className="text-gray-500 text-center py-8">Loading…</p>
              ) : medicalRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No documents uploaded yet.</p>
              ) : (
                <ul className="space-y-3">
                  {medicalRecords.map((rec) => (
                    <li
                      key={rec.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-50/60 border border-amber-100"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800">{rec.title || rec.recordType || "Document"}</p>
                        <p className="text-sm text-amber-700">{rec.recordType}</p>
                        {rec.dateAdministered && (
                          <p className="text-xs text-gray-500 mt-1">{formatDate(rec.dateAdministered)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDocument(rec.id)}
                          className="px-3 py-2 rounded-lg border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-100 transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadDocument(rec.id)}
                          className="px-3 py-2 rounded-lg border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-100 transition"
                        >
                          Download
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
