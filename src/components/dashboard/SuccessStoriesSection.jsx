'use client';

import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import StoryList, { SUCCESS_STORIES_COUNT } from "@/features/pets/StoryList";
import AnimatedCounter from "@/components/UI/AnimatedCounter";
import CartoonCardPet from "@/components/dashboard/CartoonCardPet";

const AUTO_SCROLL_INTERVAL_MS = 35;
const AUTO_SCROLL_PX = 1;

export default function SuccessStoriesSection() {
  const scrollRef = useRef(null);
  const [scrollPaused, setScrollPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || scrollPaused) return;
    const id = setInterval(() => {
      if (!scrollRef.current || scrollPaused) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight <= clientHeight) return;
      const maxScroll = scrollHeight - clientHeight;
      if (scrollTop >= maxScroll - 2) {
        scrollRef.current.scrollTop = 0;
      } else {
        scrollRef.current.scrollTop = Math.min(scrollTop + AUTO_SCROLL_PX, maxScroll);
      }
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [scrollPaused]);

  return (
    <div className="dashboard-section-card p-4 sm:p-5 relative flex flex-col min-h-0">
      {/* Cartoon pet - success (happy dog with heart), left side */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-0 opacity-90 scale-90 origin-top-left">
        <CartoonCardPet variant="success" />
      </div>
      {/* Header - same alignment as Active Alerts */}
      <div className="flex items-center justify-between gap-4 pb-4 dashboard-section-header-divider border-b relative z-10 pl-16 sm:pl-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="dashboard-section-icon-wrap flex items-center justify-center w-9 h-9 rounded-xl text-white">
            <FontAwesomeIcon icon={faTrophy} className="text-base" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Success Stories
            </h2>
            <p className="text-xs text-white/95 mt-0.5 opacity-95">
              Tail-wagging comeback stories
            </p>
          </div>
        </div>
      </div>

      {/* Fixed counter: "10" / Pets Reunited - does not scroll */}
      <div className="dashboard-section-counter-box p-4 sm:p-5 shrink-0 mt-3">
        <AnimatedCounter
          value={SUCCESS_STORIES_COUNT}
          label="Pets Reunited with Their Families"
          variant="light"
        />
      </div>

      {/* Scrollable list: 3 cards visible at a time, infinite auto-scroll */}
      <div className="relative mt-3 pt-1 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="alerts-scroll success-stories-scroll-three-cards flex-1 min-h-0 overflow-y-auto"
          onMouseEnter={() => setScrollPaused(true)}
          onMouseLeave={() => setScrollPaused(false)}
        >
          <StoryList count={SUCCESS_STORIES_COUNT} />
        </div>
      </div>
    </div>
  );
}
