'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faBrain, faSearch, faHeart, faBuilding } from "@fortawesome/free-solid-svg-icons";

function StoryCard({ story }) {
  return (
    <div className="flex gap-4 p-4 pt-6 pb-6 mb-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
      <div className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shrink-0">
        <FontAwesomeIcon icon={story.logo} />
      </div>
      <div className="flex-1">
        <h4 className="text-gray-800 font-semibold mb-2">{story.title}</h4>
        <p className="text-gray-600 text-sm mb-2">{story.story}</p>
        <span className="text-gray-500 text-xs">{story.date}</span>
      </div>
    </div>
  );
}

export default function StoryList({ count, loading = false }) {

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (!loading && count === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-2">❤️</div>
        <h3 className="text-lg font-semibold text-gray-800">
          No success stories yet
        </h3>
        <p className="text-sm text-gray-500">
          Reunited pets will appear here soon.
        </p>
      </div>
    );
  }

  const stories = [
    {
      title: "Buddy Reunited!",
      story:
        "Labrador Mix found after 12 days using QR code scan. Found by a school child who immediately contacted the owner.",
      date: "Aug 25, 2025",
      logo: faQrcode,
    },
    {
      title: "Whiskers Home Safe!",
      story:
        "Tabby Cat reunited in 5 days through AI photo matching. Shelter upload matched owner's report within hours",
      date: "Aug 25, 2025",
      logo: faBrain,
    },
    {
      title: "Bella's Big Adventure Ends!",
      story:
        "Golden Retriever found 8 km away after 7 days. A jogger scanned her QR tag and called the family right away.",
      date: "Sep 4, 2025",
      logo: faSearch,
    },
    {
      title: "Milo Back on the Couch!",
      story:
        "Persian cat located through neighborhood camera alerts in just 3 days. PetReConnect notifications guided volunteers to the area.",
      date: "Aug 30, 2025",
      logo: faHeart,
    },
    {
      title: "Rocky Found at the Park!",
      story:
        "Bulldog reunited after 9 days thanks to a passerby scanning his smart collar tag. Owner received instant location ping.",
      date: "Aug 21, 2025",
      logo: faBuilding,
    },
    {
      title: "Luna's Happy Return!",
      story:
        "Husky identified via AI photo recognition. Local rescue center confirmed match and PetReConnect coordinated safe pickup.",
      date: "Sep 10, 2025",
      logo: faSearch,
    },
    {
      title: "Cookie Spotted Again!",
      story:
        "Beagle returned home within 48 hours after QR flyer scan redirected finder to the owner's contact info.",
      date: "Sep 2, 2025",
      logo: faQrcode,
    },
    {
      title: "Shadow Reunited!",
      story:
        "Black cat found under a parked car 3 blocks away. A kind resident used the Pet ID to alert the owner instantly.",
      date: "Aug 18, 2025",
      logo: faBuilding,
    },
    {
      title: "Charlie's Journey Home!",
      story:
        "Border Collie reunited after 6 days when a delivery driver scanned his lost tag. The owner got an instant map location alert.",
      date: "Sep 14, 2025",
      logo: faQrcode,
    },
    {
      title: "Peach the Parrot Returns!",
      story:
        "Colorful Cockatiel found 3 km away perched on a balcony. QR code on her cage band led to a joyful reunion.",
      date: "Aug 28, 2025",
      logo: faBrain,
    },
  ];

  const storiesToShow = stories.slice(0, count);

  return (
    <div className="space-y-4">
      {storiesToShow.map((story, index) => (
        <StoryCard key={index} story={story} />
      ))}
    </div>
  );
};