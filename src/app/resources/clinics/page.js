'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ClinicsMap = dynamic(() => import('@/components/resources/ClinicsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl bg-orange-100/60 animate-pulse flex items-center justify-center text-orange-700">
      Loading map…
    </div>
  ),
});

const CLINICS = [
  { name: 'Cessna Lifeline Veterinary Hospital', location: 'Domlur', services: 'General care, Surgery, Emergency' },
  { name: 'Crown Vet', location: 'Koramangala', services: 'General care, Diagnostics' },
  { name: 'Dr. Doodley Pet Hospital', location: 'Jayanagar', services: 'Emergency care, Surgery, Grooming', tag: '24/7' },
  { name: 'Healthy Pawz Pets Veterinary Hospital', location: 'Bangalore', services: 'Emergency care, Wellness, Surgery', tag: '24/7' },
  { name: 'Indira Pet Clinic 24/7', location: 'Bangalore', services: 'Emergency care, Surgery, Diagnostics', tag: '24/7' },
  { name: 'Jeeva Pet Hospital', location: 'Bangalore', services: 'General care, Diagnostics' },
  { name: 'Pets First Hospital', location: 'Jayanagar', services: 'General care, Surgery, Wellness', tag: '24/7' },
  { name: 'Sanchu Animal Hospital', location: 'Koramangala', services: 'Emergency care, ICU, Surgery', tag: '24/7' },
  { name: 'Vetic Animal Hospital', location: 'Multiple locations', services: 'Emergency care, Surgery, Diagnostics', tag: '24/7' },
];

function clinicSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function PetClinicsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [filter247, setFilter247] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CLINICS.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
      const matches247 = filter247 ? c.tag === '24/7' : true;
      return matchesSearch && matches247;
    });
  }, [search, filter247]);

  return (
    <div className="bg-[#fffaf3] min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <Link
        href="/resources"
        className="mb-6 inline-flex text-orange-600 font-semibold hover:text-orange-700"
      >
        ← Back to Resources
      </Link>

      <div className="bg-linear-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-10 text-center mb-10 shadow-lg mt-4">
        <h1 className="text-4xl font-bold mb-2">Pet Clinics in Bangalore</h1>
        <p>Find the best veterinary care for your pets</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by clinic name or location..."
          className="mt-6 w-full max-w-xl mx-auto px-6 py-3 rounded-full bg-white text-gray-800 border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      <p className="text-center text-gray-600 mb-6">Showing {filtered.length} clinic(s)</p>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewMode === 'map' ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            Map View
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFilter247((prev) => !prev)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter247 ? 'bg-orange-100 text-orange-600' : 'bg-gray-200'
          }`}
        >
          24/7 Available
        </button>
      </div>

      {viewMode === 'list' && (
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl shadow p-6 relative">
              {c.tag && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  24/7
                </span>
              )}
              <h2 className="font-bold text-lg mb-1">{c.name}</h2>
              <p className="text-sm text-gray-500 mb-2">📍 {c.location}</p>
              <p className="text-sm text-gray-700">
                <span className="text-orange-500 font-semibold">Services:</span>
                <br />
                {c.services}
              </p>
              <Link
                href={`/clinics/${clinicSlug(c.name)}`}
                className="mt-4 block w-full bg-gray-200 py-2 rounded-lg font-semibold text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'map' && <ClinicsMap clinics={filtered} />}
    </div>
  );
}
