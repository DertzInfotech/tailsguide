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
    <div className="rounded-xl p-4 bg-emerald-50/60 border border-emerald-500/30 hover:shadow-xl transition">
      <div className="flex gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FontAwesomeIcon icon={story.logo} />
          </div>

          {story.verified && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="absolute -bottom-1 -right-1 text-emerald-600 bg-white rounded-full"
            />
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">{story.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{story.story}</p>
          <p className="text-xs text-gray-500 mt-2">{story.date}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= STORY LIST ================= */

export default function StoryList({ count = 10, loading = false }) {

  const stories = [
    {
      title: "Buddy Reunited!",
      story: "Labrador Mix found after 12 days using QR code scan.",
      date: "Aug 25, 2025",
      logo: faQrcode,
      verified: false,
    },
    {
      title: "Whiskers Home Safe!",
      story: "Tabby Cat reunited in 5 days through AI photo matching.",
      date: "Aug 25, 2025",
      logo: faBrain,
      verified: false,
    },
    {
      title: "Bella's Big Adventure Ends!",
      story: "Golden Retriever found 8 km away after 7 days.",
      date: "Sep 4, 2025",
      logo: faSearch,
      verified: false,
    },
    {
      title: "Milo Back on the Couch!",
      story: "Persian cat located through neighborhood alerts in just 3 days.",
      date: "Aug 30, 2025",
      logo: faHeart,
      verified: false,
    },
    {
      title: "Rocky Found at the Park!",
      story: "Bulldog reunited after 9 days thanks to a QR scan.",
      date: "Aug 21, 2025",
      logo: faBuilding,
      verified: false,
    },
    {
      title: "Luna's Happy Return!",
      story: "Husky identified via AI photo recognition.",
      date: "Sep 10, 2025",
      logo: faSearch,
      verified: false,
    },
    {
      title: "Cookie Spotted Again!",
      story: "Beagle returned home within 48 hours after flyer scan.",
      date: "Sep 2, 2025",
      logo: faQrcode,
      verified: false,
    },
    {
      title: "Shadow Reunited!",
      story: "Black cat found 3 blocks away using pet ID.",
      date: "Aug 18, 2025",
      logo: faBuilding,
      verified: false,
    },
    {
      title: "Charlie's Journey Home!",
      story: "Border Collie reunited after 6 days.",
      date: "Sep 14, 2025",
      logo: faQrcode,
      verified: false,
    },
    {
      title: "Peach the Parrot Returns!",
      story: "Cockatiel found perched on a balcony after QR scan.",
      date: "Aug 28, 2025",
      logo: faBrain,
      verified: false,
    },
  ];

  const storiesToShow = stories.slice(0, count);

  return (
    <div className="space-y-4">
      {storiesToShow.map((story, i) => (
        <StoryCard key={i} story={story} />
      ))}
    </div>
  );
}
