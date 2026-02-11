'use client';

import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";
import { useState } from "react";
import { usePets } from "@/lib/api-client";
import PetList from "@/features/pets/PetList";
import StoryList from "@/features/pets/StoryList";

export default function ReportsOverviewSection() {
  const [activeTab, setActiveTab] = useState("LOST");

  // ✅ SAME HOOK AS ACTIVE ALERTS
  const {
    pets,
    loading,
  } = usePets(0);

  // LOST pets from backend (correct data)
  const lostPets = pets.filter((p) => p.reportType === "LOST");

  return (
    <FadeIn delay={150}>
      <div className="max-w-6xl mx-auto mb-14">
        <div className="rounded-2xl p-5 sm:p-7 glass-card orange-card">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Lost & Found Reports
              </h2>
              <p className="text-sm opacity-80">
                Community reports for missing and found pets
              </p>
            </div>

            <Link
              href="/report"
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              Report a pet →
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("LOST")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                ${activeTab === "LOST"
                  ? "bg-red-500 text-white"
                  : "bg-white/70 text-gray-700 hover:bg-white"}
              `}
            >
              Lost Pets
            </button>

            <button
              onClick={() => setActiveTab("FOUND")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                ${activeTab === "FOUND"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/70 text-gray-700 hover:bg-white"}
              `}
            >
              Found Pets
            </button>
          </div>

          {/* Content */}
          <div className="alerts-scroll">

            {/* LOST = backend data */}
            {activeTab === "LOST" && (
              <PetList
                pets={lostPets}
                loading={loading}
                hidePagination
              />
            )}

            {/* FOUND = dummy success stories for now */}
            {activeTab === "FOUND" && (
              <StoryList count={10} />
            )}

          </div>
        </div>
      </div>
    </FadeIn>
  );
}
