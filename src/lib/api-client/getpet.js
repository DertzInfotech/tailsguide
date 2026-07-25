import { useCallback, useEffect, useState } from "react";
import { mergePets, PETS_INVALIDATE_EVENT } from "@/data/dummyPets";

export function usePets(page = 0) {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPets = useCallback(async () => {
    setPets(mergePets([]));
    setLoading(false);

    try {
      const res = await fetch("/api/community-pets", {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const json = await res.json();
      const raw = Array.isArray(json?.content) ? json.content : [];
      setPets(mergePets(raw));
      setCurrentPage((json?.number ?? 0) + 1);
      setTotalPages(Math.max(1, Math.ceil((json?.totalElements || 0) / 5)));
    } catch (err) {
      if (err?.name !== "TimeoutError" && err?.name !== "AbortError") {
        console.error("Error fetching pets:", err);
      }
      setPets(mergePets([]));
    }
  }, []);

  useEffect(() => {
    fetchPets();

    const onInvalidate = () => fetchPets();
    const poll = setInterval(fetchPets, 30000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchPets();
    };

    window.addEventListener(PETS_INVALIDATE_EVENT, onInvalidate);
    window.addEventListener("focus", onInvalidate);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(poll);
      window.removeEventListener(PETS_INVALIDATE_EVENT, onInvalidate);
      window.removeEventListener("focus", onInvalidate);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [page, fetchPets]);

  return { pets, currentPage, totalPages, loading, refetch: fetchPets };
}
