"use client";

import { useEffect, useRef, useState } from "react";

const getWorkerSrc = () =>
  typeof window !== "undefined"
    ? `${window.location.origin}/pdf.worker.mjs`
    : "";

export default function PdfViewer({ url, className = "" }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url || typeof url !== "string") return;
    setError(null);
    setLoading(true);
    let cancelled = false;
    let pdfDoc = null;

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = getWorkerSrc();

        const loadingTask = pdfjsLib.getDocument(url);
        const doc = await loadingTask.promise;
        if (cancelled) return;
        pdfDoc = doc;
        const numPages = doc.numPages;
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";
        const scale = 1.5;
        const padding = 16;

        for (let i = 1; i <= numPages; i++) {
          if (cancelled) return;
          const page = await doc.getPage(i);
          if (cancelled) return;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.display = "block";
          canvas.style.marginBottom = `${padding}px`;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
          canvas.style.borderRadius = "8px";
          canvas.className = "bg-white";
          container.appendChild(canvas);
          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error("PdfViewer error", e);
          setError(e?.message || "Failed to load PDF");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (pdfDoc) pdfDoc.destroy();
    };
  }, [url]);

  return (
    <div className={className}>
      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Loading PDF…
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-6 text-center">
          <p className="text-amber-800 font-medium">{error}</p>
          <p className="text-sm text-amber-700 mt-1">Use the Download button on the record to save the file.</p>
        </div>
      )}
      <div ref={containerRef} className={error ? "hidden" : ""} />
    </div>
  );
}
