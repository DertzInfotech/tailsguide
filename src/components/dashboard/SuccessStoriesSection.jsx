'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import StoryList, { SUCCESS_STORIES_COUNT } from "@/features/pets/StoryList";
import AnimatedCounter from "@/components/UI/AnimatedCounter";
import CartoonCardPet from "@/components/dashboard/CartoonCardPet";

export default function SuccessStoriesSection() {
  return (
    <div className="dashboard-section-card p-6 sm:p-8 relative">
      {/* Cartoon pet - success (happy dog with heart), left side */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-0 opacity-90">
        <CartoonCardPet variant="success" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 dashboard-section-header-divider border-b relative z-10 pl-20 sm:pl-24">
        <div className="flex items-center gap-4">
          <div className="dashboard-section-icon-wrap flex items-center justify-center w-12 h-12 rounded-2xl text-white">
            <FontAwesomeIcon icon={faTrophy} className="text-lg" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Success Stories
            </h2>
            <p className="text-sm text-white/95 mt-1 opacity-95">
              Reunited pets and happy endings from our community
            </p>
          </div>
        </div>
      </div>

      <div className="alerts-scroll relative mt-5 pt-1 space-y-4">
        <div className="dashboard-section-counter-box p-4 sm:p-5">
          <AnimatedCounter
            value={SUCCESS_STORIES_COUNT}
            label="Pets Reunited with Their Families"
            variant="light"
          />
        </div>
        <StoryList count={SUCCESS_STORIES_COUNT} />
      </div>
    </div>
  );
}
