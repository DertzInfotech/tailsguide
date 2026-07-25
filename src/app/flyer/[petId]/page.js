"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";

export default function FlyerViewerPage() {
  const { petId } = useParams();
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
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
        const pdfBlob =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        blobUrlRef.current = url;
        setBlobUrl(url);
      } catch {
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

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `flyer-pet-${petId}.pdf`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4 gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <Link href="/" className="text-orange-600 font-semibold">
          ← Back to dashboard
        </Link>
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
    <div className="min-h-screen flex flex-col bg-stone-100">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-white/95 backdrop-blur border-b border-stone-200">
        <Link href="/" className="text-orange-600 font-semibold text-sm">
          ← Back
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          className="min-h-[44px] px-4 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600"
        >
          Download PDF
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <PdfViewer url={blobUrl} className="max-w-3xl mx-auto" />
      </div>
    </div>
  );
}
