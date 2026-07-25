'use client';

import Link from 'next/link';

const CARDS = [
  {
    href: '/resources/insurance',
    title: 'Insurance Partners',
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto text-orange-500" fill="currentColor" aria-hidden>
        <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm0 2.2L6 6.1v4.9c0 3.9 2.5 7.4 6 8.8 3.5-1.4 6-4.9 6-8.8V6.1L12 4.2z" />
      </svg>
    ),
  },
  {
    href: '/resources/clinics',
    title: 'Pet Clinics',
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto text-orange-500" fill="currentColor" aria-hidden>
        <path d="M12 3a3 3 0 00-3 3v1H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-2V6a3 3 0 00-3-3zm0 2a1 1 0 011 1v1h-2V6a1 1 0 011-1zm-1 6h2v2h2v2h-2v2h-2v-2H9v-2h2v-2z" />
      </svg>
    ),
  },
  {
    href: '/resources/prevention',
    title: 'Prevention Tips',
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto text-orange-500" fill="currentColor" aria-hidden>
        <path d="M9 21h6v-1.5H9V21zm3-19a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2zm0 2a5 5 0 014.1 7.8l-.6.5V15h-7v-2.7l-.6-.5A5 5 0 0112 4z" />
      </svg>
    ),
  },
];

export default function Resources() {
  return (
    <div className="bg-[#fffaf3] min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Resources & Support</h1>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white p-6 rounded-xl shadow text-center block hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="font-bold">{card.title}</h2>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-6">Emergency Support</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
          <h3 className="font-bold text-red-800">Animal Emergency Helpline</h3>
          <p className="text-red-700 font-semibold text-xl mt-1">1-800-PET-HELP</p>
          <p className="text-sm text-red-700 mt-1">24/7 emergency support.</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-800">Mobile Veterinary Services</h3>
          <p className="text-sm text-blue-700 mb-2 mt-1">On-site emergency care.</p>
          <button type="button" className="bg-blue-500 text-white px-4 py-1 rounded-lg">
            Request Service
          </button>
        </div>

        <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-lg">
          <h3 className="font-bold text-green-800">Temporary Foster Network</h3>
          <p className="text-sm text-green-700 mb-2 mt-1">Emergency foster care.</p>
          <button type="button" className="bg-green-500 text-white px-4 py-1 rounded-lg">
            Find Foster
          </button>
        </div>
      </div>
    </div>
  );
}
