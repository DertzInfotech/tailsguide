'use client';

import Link from 'next/link';

const PROVIDERS = [
  {
    name: 'New India Assurance',
    offerings:
      'Death (illness/accident), theft/loss, third-party liability, basic veterinary costs.',
    pricing: 'Premium ~5% of sum insured',
    url: 'https://www.newindia.co.in',
  },
  {
    name: 'Universal Sompo',
    offerings: 'Surgery, hospitalization, death cover, OPD, simple claim process.',
    pricing: 'Contact for quote',
    url: 'https://www.universalsompo.com',
  },
  {
    name: 'Future Generali',
    offerings: 'Illness, accident, surgery, OPD, long-term care, quick settlement.',
    pricing: 'Age-based quote; contact online',
    url: 'https://general.futuregenerali.in',
  },
];

export default function InsurancePartnersPage() {
  return (
    <div className="bg-[#fffaf3] min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <Link
        href="/resources"
        className="mb-6 inline-flex text-orange-600 font-semibold hover:text-orange-700"
      >
        ← Back to Resources
      </Link>

      <div className="bg-linear-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-10 text-center mb-10 shadow-lg mt-4">
        <h1 className="text-4xl font-bold mb-2">Pet Insurance Providers</h1>
        <p>Compare Top Insurance Plans for Your Furry Friends</p>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl mb-10">
        <p className="text-orange-800">
          Protect your beloved pets with comprehensive insurance coverage from trusted providers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PROVIDERS.map((p) => (
          <div key={p.name} className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-3">{p.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{p.offerings}</p>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-4">
              <p className="text-xs font-semibold">PRICING</p>
              <p className="font-bold text-orange-600">{p.pricing}</p>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-orange-500 text-white py-2 rounded-lg"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
