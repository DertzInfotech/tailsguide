import { useEffect, useState } from "react";

export function usePets(page = 0) {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://tailsguide-production-53f0.up.railway.app/api/v1/pet/all?page=${page}&size=5`
        );
        const json = await res.json();

        if (res.ok) {
          setPets(json.content);
          setCurrentPage(json.number + 1);
          setTotalPages(Math.ceil(json.totalElements / 5));
        }
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
      setLoading(false);
    }

    fetchPets();
  }, [page]);

  return { pets, currentPage, totalPages, loading };
}