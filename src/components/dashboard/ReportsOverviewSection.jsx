'use client';

import FadeIn from "@/components/UI/FadeIn";
import Link from "next/link";
import { useState } from "react";
import { usePets } from "@/lib/api-client";
import PetList from "@/features/pets/PetList";
import StoryList, { SUCCESS_STORIES_COUNT } from "@/features/pets/StoryList";
import CartoonCardPet from "@/components/dashboard/CartoonCardPet";

export default function ReportsOverviewSection() {
  const [activeTab, setActiveTab] = useState("LOST");

  const { pets, loading } = usePets(0);
  const lostPets = pets.filter((p) => p.reportType === "LOST");

  return (
    <FadeIn delay={150}>
      <div className="max-w-6xl mx-auto mb-14">
        <div className="dashboard-section-card p-6 sm:p-8 relative animate-card-enter">
          {/* Cartoon pet - reports (dog with clipboard), left side */}
          <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-0 opacity-90">
            <CartoonCardPet variant="reports" />
          </div>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 dashboard-section-header-divider border-b relative z-10 pl-20 sm:pl-24">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                Lost & Found Reports
              </h2>
              <p className="text-sm text-white/95 mt-1 opacity-95">
                Community reports for missing and found pets
              </p>
            </div>
            <Link
              href="/report"
              className="dashboard-section-cta inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              Report a pet →
            </Link>
          </div>

          {/* Tabs */}
          <div className="dashboard-section-tabs-wrap flex gap-0.5 mt-5 w-fit">
            <button
              onClick={() => setActiveTab("LOST")}
              className={`px-4 py-2.5 rounded-[0.5rem] text-sm transition-all duration-200
                ${activeTab === "LOST"
                  ? "dashboard-section-tab-active"
                  : "dashboard-section-tab-inactive"}
              `}
            >
              Lost Pets
            </button>
            <button
              onClick={() => setActiveTab("FOUND")}
              className={`px-4 py-2.5 rounded-[0.5rem] text-sm transition-all duration-200
                ${activeTab === "FOUND"
                  ? "dashboard-section-tab-active"
                  : "dashboard-section-tab-inactive"}
              `}
            >
              Found Pets
            </button>
          </div>

          {/* Content */}
          <div className="alerts-scroll mt-5 pt-1">
            {activeTab === "LOST" && (
              <PetList
                pets={lostPets}
                loading={loading}
                hidePagination
              />
            )}
            {activeTab === "FOUND" && (
              <StoryList count={SUCCESS_STORIES_COUNT} />
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
