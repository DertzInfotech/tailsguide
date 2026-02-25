'use client'

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

function formatDateLabel(dateStr, isLost) {
  if (!dateStr) return isLost ? "Date unknown" : "Date unknown";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return isLost ? "Date unknown" : "Date unknown";
    const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return isLost ? `Lost on ${formatted}` : `Found on ${formatted}`;
  } catch {
    return isLost ? "Date unknown" : "Date unknown";
  }
}

/* Compact SVG icons for actions */
function FlyerIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="M9 15h6" />
    </svg>
  );
}

function PreviewIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SightingIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function PetCard({ pet, imageUrl, hideFlyerAndSighting = false, cardSize = "normal" }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const dateLabel = formatDateLabel(pet.lastSeenDate, pet.reportType === "LOST");
  const daysMissing = pet.lastSeenDate
    ? Math.floor((new Date() - new Date(pet.lastSeenDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const FLYER_URL = `/api/v1/pet/${pet.id}/flyer-pdf`;

  const isLost = pet.reportType === "LOST";
  const isRecentlyFound = !isLost && daysMissing <= 3;
  const isLarge = cardSize === "large";
  const isCompact = cardSize === "compact";

  return (
    <div
      className={`
        group relative rounded-xl
        flex border-2 transition-all duration-200 bg-white shadow-md
        ${isLarge ? "p-6 mb-6 gap-6 overflow-visible" : isCompact ? "p-3 mb-3 gap-3 overflow-hidden" : "p-4 mb-4 gap-4 overflow-hidden"}
        ${isLarge ? "min-w-0" : ""}
        ${isLost
          ? "border-orange-400/50 border-l-4 border-l-rose-500"
          : "border-orange-400/50 border-l-4 border-l-emerald-500"}
        ${isRecentlyFound
          ? "ring-2 ring-emerald-400/50"
          : ""}
        hover:shadow-lg hover:border-orange-500/60
      `}
    >

      {/* Image + badge - extra margin when large so circle isn't clipped */}
      <div className={`relative shrink-0 ${isLarge ? "flex items-center" : ""}`}>
        <div className={`rounded-full overflow-hidden flex-shrink-0 ${isLarge ? "w-24 h-24" : isCompact ? "w-12 h-12" : "w-16 h-16"}`}>
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
            px-2 py-0.5 rounded-full font-medium
            ${isLarge ? "text-[11px]" : isCompact ? "text-[9px]" : "text-[10px]"}
            ${isLost ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}
          `}
        >
          {pet.reportType}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2 items-start">
          <h4 className={`font-semibold text-orange-900 ${isLarge ? "text-lg line-clamp-2 break-words" : isCompact ? "text-sm truncate" : "truncate"}`}>
            {pet.petName || "Unknown"}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 shrink-0 font-medium ${isLarge ? "max-w-[220px] whitespace-normal text-left" : isCompact ? "max-w-[100px] truncate text-[10px] px-1.5 py-0.5" : "max-w-[140px] truncate"}`} title={dateLabel}>
            {dateLabel}
          </span>
        </div>
        <p className={`text-orange-800 mt-1 ${isLarge ? "text-sm line-clamp-2 break-words" : isCompact ? "text-xs truncate" : "text-sm truncate"}`}>
          📍 {pet.lastSeenLocation}
        </p>

        {isRecentlyFound && (
          <span className={`inline-block rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 ${isCompact ? "mt-1 px-1.5 py-0.5" : "mt-2 px-2 py-0.5"}`}>
            Recently Found 🎉
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
        {/* Flyer + Preview: grouped “get flyer” actions */}
        {!hideFlyerAndSighting && isLost && (
          <div className="flex flex-col items-stretch rounded-2xl border border-orange-200/80 bg-linear-to-br from-orange-50/90 to-amber-50/80 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => openFlyerInNewWindow(pet.id)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-sm transition-all duration-200 ease-out"
            >
              <FlyerIcon className="w-3.5 h-3.5 shrink-0" />
              Get flyer
            </button>
            <button
              type="button"
              disabled={previewLoading}
              onClick={() => openPreviewInModal(FLYER_URL, setPreviewBlobUrl, setPreviewLoading, setPreviewOpen)}
              className="inline-flex items-center justify-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-orange-600 hover:text-orange-700 hover:bg-white/70 transition-colors duration-200 disabled:opacity-60"
            >
              <PreviewIcon className="w-3 h-3 shrink-0 opacity-80" />
              {previewLoading ? "…" : "Preview"}
            </button>
          </div>
        )}
        {/* Preview modal - portaled to body so it's above card and doesn't flicker */}
        {!hideFlyerAndSighting && previewOpen && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/20 cursor-pointer"
            onClick={(e) => {
              if (e.target !== e.currentTarget) return;
              setPreviewOpen(false);
              if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
              setPreviewBlobUrl(null);
            }}
            role="presentation"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden border border-stone-200 ring-2 ring-black/10 cursor-default"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Flyer preview"
            >
              <div className="flex items-center justify-end p-2 shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setPreviewOpen(false);
                    if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
                    setPreviewBlobUrl(null);
                  }}
                  className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                  aria-label="Close preview"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 min-h-0 px-4 pb-6 -mt-2 overflow-hidden flex flex-col">
                {previewBlobUrl ? (
                  <iframe
                    src={`${previewBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="Flyer preview"
                    className="w-full flex-1 min-h-0 rounded-xl border-0 bg-stone-100 overflow-hidden"
                    style={{ minHeight: "85vh" }}
                  />
                ) : (
                  <p className="text-stone-500 py-12 text-center font-medium">Loading…</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
        {!hideFlyerAndSighting && isLost && (
          <Link
            href={`/spotted/${pet.id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white whitespace-nowrap
              bg-linear-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
              shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow
              border border-amber-400/30 transition-all duration-200 ease-out"
          >
            <SightingIcon className="w-3.5 h-3.5 shrink-0" />
            Report sighting
          </Link>
        )}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function openFlyerInNewWindow(petId) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/flyer/${petId}` : `/flyer/${petId}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function openPreviewInModal(url, setBlobUrl, setLoading, setOpen) {
  setOpen(true);
  setBlobUrl(null);
  setLoading(true);
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const fileUrl = URL.createObjectURL(blob);
    setBlobUrl(fileUrl);
  } catch {
    setOpen(false);
    alert("Unable to load preview.");
  } finally {
    setLoading(false);
  }
}
