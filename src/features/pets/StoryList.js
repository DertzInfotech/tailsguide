'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faBrain,
  faSearch,
  faHeart,
  faBuilding,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

/* ================= STORY CARD ================= */

function StoryCard({ story }) {
  return (
    <div className="group rounded-xl p-3 sm:p-4 bg-white border-2 border-orange-400/40 hover:border-orange-500/60 hover:shadow-lg transition-all duration-200 flex gap-3 border-l-4 border-l-orange-500 shadow-md">
      <div className="relative shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow">
          <FontAwesomeIcon icon={story.logo} className="text-sm sm:text-base" />
        </div>
        {story.verified && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="absolute -bottom-0.5 -right-0.5 text-orange-600 bg-white rounded-full drop-shadow"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-orange-900 text-sm sm:text-base">{story.title}</h4>
        <p className="text-sm text-orange-800/90 mt-0.5 leading-snug line-clamp-2">{story.story}</p>
        <p className="text-xs text-orange-700 mt-1.5">{story.date}</p>
      </div>
    </div>
  );
}

/* ================= SHARED DUMMY SUCCESS STORIES (single source of truth) ================= */

export const SUCCESS_STORIES = [
  { title: "Buddy Reunited!", story: "Labrador Mix found after 12 days using QR code scan.", date: "Aug 25, 2025", logo: faQrcode, verified: false },
  { title: "Whiskers Home Safe!", story: "Tabby Cat reunited in 5 days through AI photo matching.", date: "Aug 25, 2025", logo: faBrain, verified: false },
  { title: "Bella's Big Adventure Ends!", story: "Golden Retriever found 8 km away after 7 days.", date: "Sep 4, 2025", logo: faSearch, verified: false },
  { title: "Milo Back on the Couch!", story: "Persian cat located through neighborhood alerts in just 3 days.", date: "Aug 30, 2025", logo: faHeart, verified: false },
  { title: "Rocky Found at the Park!", story: "Bulldog reunited after 9 days thanks to a QR scan.", date: "Aug 21, 2025", logo: faBuilding, verified: false },
  { title: "Luna's Happy Return!", story: "Husky identified via AI photo recognition.", date: "Sep 10, 2025", logo: faSearch, verified: false },
  { title: "Cookie Spotted Again!", story: "Beagle returned home within 48 hours after flyer scan.", date: "Sep 2, 2025", logo: faQrcode, verified: false },
  { title: "Shadow Reunited!", story: "Black cat found 3 blocks away using pet ID.", date: "Aug 18, 2025", logo: faBuilding, verified: false },
  { title: "Charlie's Journey Home!", story: "Border Collie reunited after 6 days.", date: "Sep 14, 2025", logo: faQrcode, verified: false },
  { title: "Peach the Parrot Returns!", story: "Cockatiel found perched on a balcony after QR scan.", date: "Aug 28, 2025", logo: faBrain, verified: false },
];

export const SUCCESS_STORIES_COUNT = SUCCESS_STORIES.length;

/* ================= STORY LIST ================= */

export default function StoryList({ count = SUCCESS_STORIES_COUNT, loading = false }) {
  const storiesToShow = SUCCESS_STORIES.slice(0, count);

  return (
    <div className="space-y-3">
      {storiesToShow.map((story, i) => (
        <StoryCard key={i} story={story} />
      ))}
    </div>
  );
}
