'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import StoryList from "@/features/pets/StoryList";

export default function SuccessStoriesSection({ count }) {

  const mockStories = [
    "Max was reunited with his family in just 6 hours",
    "Bella found her way home after 2 days",
    "Rocky was safely returned thanks to a neighborhood alert",
    "Coco’s microchip helped reunite her within hours",
    "Simba was spotted by a volunteer and brought home safely",
    "Lucy’s family found her through the community network",
  ];

  return (
    <div
      className="rounded-2xl p-5 sm:p-7 glass-card orange-card
      transition-all duration-300 ease-out
      hover:-translate-y-1"
    >
      <div className="flex items-start gap-4 mb-4">
        <FontAwesomeIcon
          icon={faTrophy}
          className="text-2xl mt-1"
        />

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Recent Success Stories
          </h2>
          <p className="text-sm">
            Reunited pets and happy endings from our community
          </p>
        </div>
      </div>

      {count === 0 ? (
        <div
          className="relative h-48 overflow-hidden scroll-pause"
          onTouchStart={(e) => {
            e.currentTarget
              .querySelector('.animate-scroll-y')
              ?.classList.add('scroll-paused');
          }}
          onTouchEnd={(e) => {
            e.currentTarget
              .querySelector('.animate-scroll-y')
              ?.classList.remove('scroll-paused');
          }}
        >
          <div className="absolute inset-0 animate-scroll-y">
            {[...mockStories, ...mockStories].map((story, idx) => (
              <div
                key={idx}
                className="bg-[#fee2c0] rounded-xl p-4 mb-3 shadow-sm"
              >
                <p className="text-sm text-gray-900 leading-relaxed">
                  ❤️ {story}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <StoryList count={count} />
      )}
    </div>
  );
}
