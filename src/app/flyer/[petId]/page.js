"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function FlyerViewerPage() {
  const { petId } = useParams();
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const blobUrlRef = useRef(null);

  useEffect(() => {
    if (!petId) return;
    let revoked = false;
    const run = async () => {
      try {
        const res = await fetch(`/api/v1/pet/${petId}/flyer-pdf`);
        if (!res.ok) throw new Error("Failed to load flyer");
        const blob = await res.blob();
        if (revoked) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobUrl(url);
      } catch (e) {
        if (!revoked) setError("Could not load flyer.");
      }
    };
    run();
    return () => {
      revoked = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [petId]);

  useEffect(() => {
    if (!blobUrl) return;
    const t = setTimeout(() => setShowDownloadModal(true), 1000);
    return () => clearTimeout(t);
  }, [blobUrl]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `flyer-pet-${petId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowDownloadModal(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <p className="text-stone-600 font-medium">Loading flyer…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-200">
      <iframe
        src={blobUrl}
        title="Flyer"
        className="flex-1 w-full min-h-[80vh] border-0"
      />
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-amber-100" onClick={(e) => e.stopPropagation()}>
            <p className="text-gray-800 font-semibold mb-4">Would you like to download this flyer?</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50"
              >
                No thanks
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
