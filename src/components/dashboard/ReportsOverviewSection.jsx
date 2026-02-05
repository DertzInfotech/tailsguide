'use client';

import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";

function detectReportType(pet) {
  // try every common possibility safely
  if (!pet) return null;

  if (typeof pet.reportType === "string") return pet.reportType;
  if (typeof pet.status === "string") return pet.status;
  if (typeof pet.type === "string") return pet.type;

  if (pet.isLost === true) return "LOST";
  if (pet.isFound === true) return "FOUND";

  return null;
}

export default function ReportsOverviewSection({ pets = [] }) {
  const reports = pets
    .map((pet) => {
      const rawType = detectReportType(pet);
      if (!rawType) return null;

      const type = rawType.toLowerCase();
      if (!type.includes("lost") && !type.includes("found")) return null;

      return { ...pet, __reportType: type.includes("lost") ? "LOST" : "FOUND" };
    })
    .filter(Boolean);

  return (
    <FadeIn delay={150}>
      <div className="max-w-6xl mx-auto mb-10">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Lost & Found Reports
          </h2>

          <Link
            href="/search"
            className="text-sm font-medium text-orange-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#E3D8CB]/70 backdrop-blur-xl shadow-md p-5 sm:p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
          {reports.length === 0 ? (
            <div className="text-sm text-gray-700">
              No lost or found reports available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-xl bg-white/40 backdrop-blur-md p-4 border border-black/5"
                >
                  {/* Title */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">
                      {pet.name || "Unnamed Pet"}
                    </h3>

                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${
                          pet.__reportType === "LOST"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {pet.__reportType}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 truncate">
                    {pet.breed || "Breed not specified"}
                  </p>

                  {pet.lastSeenLocation && (
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      📍 {pet.lastSeenLocation}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      href={`/pet/${pet.id}`}
                      className="text-sm font-medium text-orange-primary hover:underline"
                    >
                      View details
                    </Link>

                    {pet.__reportType === "LOST" && (
                      <button
                        onClick={() =>
                          console.log("Generate flyer for pet:", pet.id)
                        }
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-primary text-white hover:bg-orange-600 transition"
                      >
                        Generate Flyer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
