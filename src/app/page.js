'use client'

import { useState, useCallback } from "react";
import { usePets } from "@/lib/api-client";
import FadeIn from "@/components/ui/FadeIn";
import HeroSection from "@/components/dashboard/HeroSection";
import dynamic from "next/dynamic";

const AlertsSection = dynamic(
  () => import("@/components/dashboard/AlertsSection"),
  { ssr: false }
);

const SuccessStoriesSection = dynamic(
  () => import("@/components/dashboard/SuccessStoriesSection"),
  { ssr: false }
);

const StatsOverview = dynamic(
  () => import("@/components/dashboard/StatsOverview"),
  { ssr: false }
);

function CardSkeleton() {
  return (
    <div className="h-64 rounded-2xl bg-[#E3D8CB] animate-pulse/60 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg" />
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-[#E3D8CB] animate-pulse/60 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const { pets, currentPage, totalPages, loading } = usePets(page);

  const handlePageChange = useCallback((p) => {
    setPage(p);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-transparent">

      {/* PAGE CONTENT */}
      <div className="relative overflow-hidden flex-grow">
        <div aria-hidden className="paw-background" />

        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[url('/noise.png')] animate-[grainBreath_20s_ease-in-out_infinite]"
        />

        {/* Hero */}
        <section className="px-6 pt-6 pb-16 relative">
          <HeroSection />
        </section>

        {/* Alerts + Stats */}
        <section className="px-6 pt-0 pb-12 rounded-t-[2.5rem] page-glass-bg">
          <FadeIn delay={200}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
              {loading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  <AlertsSection
                    pets={pets}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    onPageChange={handlePageChange}
                  />
                  <SuccessStoriesSection count={pets.length} />
                </>
              )}
            </div>
          </FadeIn>

          <section className="pt-4 pb-4">
            <div className="max-w-6xl mx-auto">
              {loading ? <StatsSkeleton /> : <StatsOverview />}
            </div>

            <div className="max-w-6xl mx-auto mt-4">
              <div className="h-px bg-linear-to-r from-transparent via-[#D6C4B5] to-transparent" />
            </div>
          </section>
        </section>
      </div>

      {/* FOOTER — LAST ELEMENT */}
      <footer className="relative z-50 bg-[#f6f1eb]/85 backdrop-blur-md border-t border-[#c8b4a0]/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-[#3b2f26]">
          <span className="font-medium">
            © 2026 tailsGuide. All rights reserved.
          </span>
          <span className="text-[#5a4a3a]">
            Built with care for pets & people 🐾
          </span>
        </div>
      </footer>

    </main>
  );
}
