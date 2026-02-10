'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import StoryList from "@/features/pets/StoryList";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function SuccessStoriesSection({ count }) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl p-5 sm:p-7
        glass-card orange-card
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* 🟢 Soft success glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon
            icon={faTrophy}
            className="text-2xl text-emerald-500"
          />

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Recent Success Stories
            </h2>
            <p className="text-sm opacity-80">
              Reunited pets and happy endings from our community
            </p>
          </div>
        </div>

        {/* Success badge */}
        <span
          className="
            rounded-full px-3 py-1
            text-xs font-semibold
            bg-emerald-500/15 text-emerald-600
          "
        >
          SUCCESS
        </span>
      </div>

      {/* 🔑 SCROLL AREA */}
      <div className="alerts-scroll relative space-y-3">

  {/* 🔢 Animated trust counter */}
  <AnimatedCounter
    value={1248}
    label="Pets Reunited with Their Families"
  />

  {/* Success stories list */}
  {count > 0 && <StoryList count={count} />}

</div>

    </div>
  );
}
