import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { heroStatsInfo, mainTilesInfo, sectionHeadersInfo, statsCardsInfo } from "./info";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-orange-primary to-orange-light">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Text Section */}
            <div className="text-white text-center lg:text-left space-y-8">
              <div>
                <h1
                  className="text-4xl lg:text-5xl font-bold leading-tight mb-4
                  [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]"
                >
                  Every Pet Counts. Every Paw Matters.
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed opacity-95 max-w-xl mx-auto lg:mx-0">
                  Smart QR tags, AI photo ID, wellness tracking, and community care
                  empowering every pet owner to protect, connect, and nurture because
                  your pet isn&apos;t just an animal, they&apos;re family.
                </p>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap gap-8 lg:gap-12 justify-center lg:justify-start">
                {heroStatsInfo.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold mb-1">{stat.number}</div>
                    <div className="text-sm lg:text-base opacity-90">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {mainTilesInfo.map((tile, index) => (
                <Link href={tile.link} key={index}>
                  <button className="bg-white rounded-2xl p-7 lg:p-8 shadow-lg hover:shadow-xl text-center group transition-transform duration-200 hover:scale-105 w-full">
                    <div className="text-orange-primary mb-4">
                      {tile.customIcon || (
                        <FontAwesomeIcon icon={tile.icon} className="text-6xl mx-auto" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {tile.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                      {tile.description}
                    </p>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Alerts Section */}
      <section className="py-16 lg:py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {sectionHeadersInfo.map((header, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
                <div className="flex items-center gap-4">
                  {header.customIcon || (
                    <FontAwesomeIcon icon={header.icon} className="text-orange-primary text-3xl" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {header.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCardsInfo.map((card, index) => (
              <div key={index} className="bg-white rounded-2xl p-7 lg:p-8 shadow-md text-center">
                <div className="text-orange-primary mb-4">
                  {card.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-1">{card.number}</div>
                <div className="text-gray-500 text-sm">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
