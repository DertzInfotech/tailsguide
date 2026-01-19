'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import StoryList from "@/features/pets/StoryList";

export default function SuccessStoriesSection({ count }) {
  return (
    <div className="rounded-2xl p-5 sm:p-7 glass-card orange-card
  transition-all duration-300 ease-out
  hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <FontAwesomeIcon
          icon={faTrophy}
          className="text-2xl mt-1"

        />

        <div>
          <h2
            className="text-2xl font-extrabold tracking-tight"

          >
            Recent Success Stories
          </h2>
          <p
            className="text-sm"

          >
            Reunited pets and happy endings from our community
          </p>
        </div>
      </div>

      <StoryList count={count} />
    </div>
  );
}
