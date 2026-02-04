"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePets } from "@/context/PetContext";

export default function CompleteProfile() {
  const router = useRouter();
  const { addPet, markProfileCompleted } = usePets();

  const [petName, setPetName] = useState("");

  // 🔐 PAGE PROTECTION
  useEffect(() => {
    const completed = localStorage.getItem("profileCompleted");
    if (completed === "true") {
      router.replace("/"); // redirect to dashboard
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    addPet({ name: petName });
    markProfileCompleted();
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Complete Your Pet Profile 🐾
        </h2>

        <input
          required
          placeholder="Pet Name"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="border p-3 rounded-xl w-full mb-4"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
