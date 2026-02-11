import { useEffect, useState } from "react";
import api from "./index";

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
          `/api/v1/pet/all?page=0&size=10&sortBy=lastSeenDate&sortDirection=desc`
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