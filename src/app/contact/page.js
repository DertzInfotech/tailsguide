"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fefaf5] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-linear-to-br from-orange-300/35 via-amber-200/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-linear-to-tr from-amber-300/30 via-orange-200/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(249,115,22,0.08)_1px,transparent_0)] bg-size-[18px_18px] opacity-60" />
      {/* Pet-themed visual layer (subtle pawprints + floating blobs) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply">
        <div className="absolute -left-12 top-20 h-64 w-64 rounded-full bg-linear-to-br from-orange-300/60 via-amber-200/30 to-transparent blur-2xl" />
        <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-linear-to-tr from-amber-300/55 via-orange-200/25 to-transparent blur-2xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-linear-to-t from-orange-200/40 to-transparent blur-2xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27 viewBox=%270 0 120 120%27%3E%3Cg fill=%27%23f97316%27 fill-opacity=%271%27%3E%3Cg transform=%27translate(18 22) rotate(-18)%27%3E%3Cellipse cx=%2720%27 cy=%2722%27 rx=%2710%27 ry=%2712%27/%3E%3Cellipse cx=%278%27 cy=%2714%27 rx=%275.3%27 ry=%277%27/%3E%3Cellipse cx=%2732%27 cy=%2712%27 rx=%275.3%27 ry=%277%27/%3E%3Cellipse cx=%279%27 cy=%2730%27 rx=%275%27 ry=%276.7%27/%3E%3Cellipse cx=%2731%27 cy=%2730%27 rx=%275%27 ry=%276.7%27/%3E%3C/g%3E%3Cg transform=%27translate(76 74) rotate(22)%27%3E%3Cellipse cx=%2720%27 cy=%2722%27 rx=%2710%27 ry=%2712%27/%3E%3Cellipse cx=%278%27 cy=%2714%27 rx=%275.3%27 ry=%277%27/%3E%3Cellipse cx=%2732%27 cy=%2712%27 rx=%275.3%27 ry=%277%27/%3E%3Cellipse cx=%279%27 cy=%2730%27 rx=%275%27 ry=%276.7%27/%3E%3Cellipse cx=%2731%27 cy=%2730%27 rx=%275%27 ry=%276.7%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-orange-600 uppercase">
            Support
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Contact
          </h1>
          <p className="mt-3 text-gray-600">
            For any issue or query, you can contact{" "}
            <span className="font-semibold text-orange-700">Dertz Infotech</span>.
          </p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_24px_80px_-35px_rgba(17,24,39,0.45)] overflow-hidden">
          <div className="p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-12 w-12 rounded-2xl bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-md flex items-center justify-center">
                <span className="text-xl leading-none">✉️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  Get in touch
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Use the official contact form and the team will respond as soon as possible.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="https://www.dertzinfotech.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#fa7c15] text-white font-semibold shadow-lg shadow-orange-200/50 hover:shadow-orange-300/60 hover:scale-[1.01] active:scale-[0.99] transition"
              >
                Open Dertz Infotech Contact Form
                <span aria-hidden>↗</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/70 border border-amber-100 text-gray-800 font-semibold hover:bg-white transition"
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Faster support", desc: "Share screenshots and steps to reproduce." },
                { title: "Account issues", desc: "Include your login email address." },
                { title: "Pet records", desc: "Mention the pet name and record type." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-white/60 bg-white/60 px-4 py-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                  <div className="mt-1 text-xs text-gray-600">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-7 sm:px-9 py-5 bg-linear-to-r from-orange-50/70 to-amber-50/70 border-t border-amber-100 text-xs text-gray-500">
            Tip: If the link doesn’t open, copy and paste this into your browser:{" "}
            <span className="font-medium text-gray-700">www.dertzinfotech.com/contact</span>
          </div>
        </div>
      </div>
    </div>
  );
}

