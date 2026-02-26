'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getSearchPets, getPetMatches, getMyPets } from '@/api/petApi';
import PetCard from '@/features/pets/PetCard';
import { useAuth } from '@/context/AuthContext';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

function usePetMarkerIcon(isLost) {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    const color = isLost ? '#e11d48' : '#059669';
    return L.divIcon({
      html: `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${color};color:white;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">${isLost ? '🐕' : '🐾'}</span>`,
      className: 'pet-marker-div',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }, [isLost]);
}

function PetMapMarker({ pet, coords }) {
  const isLost = (pet.reportType || '').toUpperCase() === 'LOST';
  const icon = usePetMarkerIcon(isLost);
  if (!icon) return null;
  return (
    <Marker position={coords} icon={icon}>
      <Popup>
        <div className="min-w-[140px]">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 ${isLost ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {pet.reportType || '—'}
          </span>
          <p className="font-semibold text-stone-800">{pet.petName || 'Unknown'}</p>
          {pet.breed && <p className="text-xs text-stone-600">{pet.breed}</p>}
          {pet.lastSeenLocation && (
            <p className="text-xs text-stone-500 mt-0.5">📍 {pet.lastSeenLocation}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

const PET_TYPES = ['', 'Dog', 'Cat', 'Bird', 'Other'];
const DEFAULT_CENTER = [12.9716, 77.5946]; // Bangalore
const DEFAULT_ZOOM = 11;

// Map location text to [lat, lng] for Bangalore/India areas; unknown locations get center + small offset
const LOCATION_COORDS = {
  bangalore: [12.9716, 77.5946],
  hsr: [12.9121, 77.6446],
  thippasandra: [12.9650, 77.6420],
  '4th main thippasandra': [12.9650, 77.6420],
  koramangala: [12.9352, 77.6245],
  jayanagar: [12.925, 77.5938],
  domlur: [12.9606, 77.6376],
  whitefield: [12.9698, 77.7499],
  marathahalli: [12.9592, 77.6974],
  indiranagar: [12.9784, 77.6408],
  yeswanthpur: [13.0286, 77.5367],
  sadashivanagar: [13.0169, 77.5832],
  'kalyan nagar': [13.0281, 77.6433],
  shivajinagar: [13.0012, 77.6016],
};

function getPetCoords(pet, index) {
  const loc = (pet.lastSeenLocation || '').trim().toLowerCase();
  if (!loc) return [DEFAULT_CENTER[0] + (index % 5) * 0.02, DEFAULT_CENTER[1] + (index % 3) * 0.02];
  const exact = LOCATION_COORDS[loc];
  if (exact) return exact;
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (loc.includes(key) || key.includes(loc)) return coords;
  }
  return [DEFAULT_CENTER[0] + (index % 5) * 0.02, DEFAULT_CENTER[1] + (index % 3) * 0.02];
}

const SEARCH_MODE = 'search';
const POTENTIAL_MATCH_MODE = 'potential-match';

function normalize(s) {
  if (s == null || typeof s !== 'string') return '';
  return s.trim().toLowerCase();
}

function matchesQuery(pet, q) {
  if (!q) return true;
  const k = normalize(q);
  const name = normalize(pet.petName);
  const breed = normalize(pet.breed);
  const location = normalize(pet.lastSeenLocation);
  const color = normalize(pet.primaryColor);
  const type = normalize(pet.petType || '');
  return name.includes(k) || breed.includes(k) || location.includes(k) || color.includes(k) || type.includes(k);
}

export default function SearchPage() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState(SEARCH_MODE); // 'search' | 'potential-match'
  const [activeView, setActiveView] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('');
  const [animalFilter, setAnimalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Potential Match: user's lost pets + selected pet + matches
  const [myLostPets, setMyLostPets] = useState([]);
  const [myLostPetsLoading, setMyLostPetsLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [matchPets, setMatchPets] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getSearchPets(0, 100);
        if (!cancelled && res?.data?.content) {
          setAllPets(res.data.content);
        }
      } catch (err) {
        if (!cancelled) setAllPets([]);
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const loadMyLostPets = async () => {
    if (!isAuthenticated) return;
    setMyLostPetsLoading(true);
    try {
      const res = await getMyPets();
      const list = Array.isArray(res?.data) ? res.data : [];
      const lost = list.filter((p) => (p.reportType || '').toUpperCase() === 'LOST');
      setMyLostPets(lost);
      if (lost.length) setSelectedPetId((prev) => prev || String(lost[0].id));
    } catch (err) {
      setMyLostPets([]);
      console.error(err);
    } finally {
      setMyLostPetsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === POTENTIAL_MATCH_MODE && isAuthenticated) {
      loadMyLostPets();
    }
  }, [mode, isAuthenticated]);

  useEffect(() => {
    if (mode !== POTENTIAL_MATCH_MODE || !selectedPetId) {
      setMatchPets([]);
      return;
    }
    let cancelled = false;
    setMatchesLoading(true);
    getPetMatches(selectedPetId)
      .then((res) => {
        if (!cancelled && Array.isArray(res?.data)) setMatchPets(res.data);
        else if (!cancelled) setMatchPets([]);
      })
      .catch(() => {
        if (!cancelled) setMatchPets([]);
      })
      .finally(() => {
        if (!cancelled) setMatchesLoading(false);
      });
    return () => { cancelled = true; };
  }, [mode, selectedPetId]);

  const { locations, breeds, colors } = useMemo(() => {
    const locs = new Set();
    const br = new Set();
    const col = new Set();
    allPets.forEach((p) => {
      if (p.lastSeenLocation) locs.add(p.lastSeenLocation.trim());
      if (p.breed) br.add(p.breed.trim());
      if (p.primaryColor) col.add(p.primaryColor.trim());
    });
    return {
      locations: [...locs].sort(),
      breeds: [...br].sort(),
      colors: [...col].sort(),
    };
  }, [allPets]);

  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      if (!matchesQuery(pet, searchQuery)) return false;
      if (statusFilter) {
        const reportType = (pet.reportType || '').toUpperCase();
        if (statusFilter === 'lost' && reportType !== 'LOST') return false;
        if (statusFilter === 'found' && reportType !== 'FOUND') return false;
      }
      if (animalFilter) {
        const type = (pet.petType || '').toLowerCase();
        if (type !== animalFilter.toLowerCase()) return false;
      }
      if (locationFilter && (pet.lastSeenLocation || '').trim() !== locationFilter) return false;
      if (breedFilter && (pet.breed || '').trim() !== breedFilter) return false;
      if (colorFilter && (pet.primaryColor || '').trim() !== colorFilter) return false;
      return true;
    });
  }, [allPets, searchQuery, statusFilter, animalFilter, locationFilter, breedFilter, colorFilter]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f5] via-[#fef7ed] to-[#f5f0e8]" aria-hidden />
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl" aria-hidden />

      <section id="search" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-2">
            Find & Reunite
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-800 mb-2">
            Search Lost & Found Pets
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Search our database of lost and found pets. Every search brings a pet closer to home.
          </p>
        </div>

        {/* Mode toggle: Search | Potential Match */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode(SEARCH_MODE)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === SEARCH_MODE
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white/90 text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setMode(POTENTIAL_MATCH_MODE)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === POTENTIAL_MATCH_MODE
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white/90 text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            Potential Match
          </button>
        </div>

        {/* Potential Match: select lost pet + results */}
        {mode === POTENTIAL_MATCH_MODE && (
          <div className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100/80 overflow-hidden border-l-4 border-l-amber-400 p-4 sm:p-6 lg:p-8 mb-8">
            {!isAuthenticated ? (
              <div className="text-center py-10">
                <p className="text-stone-700 font-medium mb-2">Sign in to find potential matches for your lost pet.</p>
                <Link href="/signin" className="text-amber-600 font-semibold hover:underline">Sign In</Link>
              </div>
            ) : myLostPetsLoading ? (
              <div className="text-center py-10 text-stone-500">Loading your pets…</div>
            ) : myLostPets.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-stone-700 font-medium mb-2">Add a lost pet in My Pets to find potential matches.</p>
                <Link href="/my-pet" className="text-amber-600 font-semibold hover:underline">My Pets</Link>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-stone-600 mb-2">Select your lost pet</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full max-w-md px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400/60 mb-4"
                >
                  <option value="">Select a pet</option>
                  {myLostPets.map((p) => (
                    <option key={p.id} value={p.id}>{p.petName || 'Unknown'} {p.breed ? `(${p.breed})` : ''}</option>
                  ))}
                </select>
                <p className="text-sm text-stone-500">
                  We’ll show pets from our list that may match this one by details like color, location, breed, and features.
                </p>
              </>
            )}
          </div>
        )}

        {/* Search + filters card (only in Search mode) */}
        {mode === SEARCH_MODE && (
        <div className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100/80 overflow-hidden border-l-4 border-l-amber-400 p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-stone-200 bg-white/80 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition"
                placeholder="Search by name, breed, location, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            {/* Filters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All status</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>

              <select
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
              >
                <option value="">All pet types</option>
                {PET_TYPES.filter(Boolean).map((t) => (
                  <option key={t} value={t}>{t}s</option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
                value={breedFilter}
                onChange={(e) => setBreedFilter(e.target.value)}
              >
                <option value="">All breeds</option>
                {breeds.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <option value="">All colors</option>
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setAnimalFilter('');
                  setLocationFilter('');
                  setBreedFilter('');
                  setColorFilter('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 text-sm font-medium transition"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
        )}

        {/* View toggle (Search mode only) */}
        {mode === SEARCH_MODE && (
        <div className="flex justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeView === 'grid'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-white/95 text-stone-600 hover:bg-stone-50 border border-stone-200 shadow-sm'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-white/95 text-stone-600 hover:bg-stone-50 border border-stone-200 shadow-sm'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            Map
          </button>
        </div>
        )}

        {/* Results count (Search mode) */}
        {mode === SEARCH_MODE && (
        <p className="text-center text-base text-stone-600 font-medium mb-6">
          {loading ? 'Loading…' : `${filteredPets.length} pet${filteredPets.length !== 1 ? 's' : ''} found`}
        </p>
        )}

        {/* Potential Match results */}
        {mode === POTENTIAL_MATCH_MODE && isAuthenticated && myLostPets.length > 0 && (
          <>
            <p className="text-center text-base text-stone-600 font-medium mb-6">
              {matchesLoading ? 'Loading matches…' : `${matchPets.length} potential match${matchPets.length !== 1 ? 'es' : ''}`}
            </p>
            <div className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100/70 overflow-visible p-5 sm:p-8">
              {matchesLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-5xl mx-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-36 sm:h-44 rounded-2xl bg-stone-100/80 animate-pulse" />
                  ))}
                </div>
              ) : matchPets.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-stone-700">No potential matches yet</h3>
                  <p className="text-stone-500 max-w-sm mx-auto mt-2">
                    We couldn’t find pets that closely match. Check back later or broaden your pet’s details.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-5xl mx-auto">
                  {matchPets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      imageUrl={`/api/v1/pet/${pet.id}/thumbnail`}
                      hideFlyerAndSighting={false}
                      cardSize="large"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Grid: Search mode */}
        {mode === SEARCH_MODE && activeView === 'grid' && (
          <div className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100/70 overflow-visible p-5 sm:p-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-36 sm:h-44 rounded-2xl bg-stone-100/80 animate-pulse" />
                ))}
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-stone-700">No pets match your filters</h3>
                <p className="text-stone-500 max-w-sm mx-auto mt-2">
                  Try changing your search or filters to see more lost and found pets.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {filteredPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    imageUrl={`/api/v1/pet/${pet.id}/thumbnail`}
                    hideFlyerAndSighting={false}
                    cardSize="large"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map view: Leaflet map with pet location markers (Search mode only) */}
        {mode === SEARCH_MODE && activeView === 'map' && (
          <div className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-amber-100/70 overflow-hidden">
            <div className="h-[480px] sm:h-[520px] w-full">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredPets.map((pet, index) => {
                  const coords = getPetCoords(pet, index);
                  return <PetMapMarker key={pet.id} pet={pet} coords={coords} />;
                })}
              </MapContainer>
            </div>
            <p className="text-center text-sm text-stone-500 py-3 border-t border-amber-100/60">
              Pet locations are approximate. Click a marker to see details.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
