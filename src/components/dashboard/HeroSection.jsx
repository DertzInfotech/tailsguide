'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { heroStatsInfo, mainTilesInfo } from "@/app/info";
import Link from "next/link";
import CountUp from "@/components/UI/CountUp";

export default function HeroSection() {
  return (
    <section className="
  pt-4 pb-16 lg:pt-6 lg:pb-20
  relative overflow-hidden
  bg-[linear-gradient(to_bottom,rgba(249,154,0,0.95),rgba(255,156,64,0.98))]
">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem]">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Text */}
            <div
              className="text-center lg:text-left space-y-8"
              style={{ color: "var(--foreground)" }}
            >
              <div>

                {/* PET PEEK STRIP */}
                <div className="pet-strip-wrapper mb-1">
                  <img
                    src="/images/pet-strip.png"
                    alt="Cat and dog peeking through fabric"
                    className="pet-strip"
                  />
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight"
                  style={{ color: "#2b1e00" }}
                >
                  Every Pet Counts. Every Paw Matters.
                </h1>

                <p
                  className="text-lg lg:text-xl max-w-xl mx-auto lg:mx-0"
                  style={{ color: "#4a3300" }}
                >
                  Smart QR tags, AI photo ID, wellness tracking, and community care
                  empowering every pet owner.
                </p>
              </div>

              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                {heroStatsInfo.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#b02a00" }}
                    >

                      <CountUp value={stat.number} />
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "#5a3b00" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {mainTilesInfo.map((tile, i) => (
                <Link href={tile.link} key={i}>
                  <button
                    className="
    w-full h-full
    rounded-2xl p-5 sm:p-7 glass-card
    hover:-translate-y-1
    hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]
    transition-transform
  "
                    style={{ borderTop: "4px solid var(--amber)" }}
                  >
                    <div
                      className="mb-4"
                      style={{ color: "var(--orange)" }}
                    >

                      {tile.customIcon || (
                        <FontAwesomeIcon icon={tile.icon} className="text-5xl mx-auto" />
                      )}
                    </div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {tile.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {tile.description}
                    </p>
                  </button>
                </Link>
              ))}
            </div>
            <div
              className="absolute bottom-0 left-0 w-full h-12"
              style={{
                background: "linear-gradient(to bottom, #e4a444, #ec9654)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
