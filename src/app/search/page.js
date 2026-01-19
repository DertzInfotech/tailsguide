'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SearchPage() {
  const [activeView, setActiveView] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('');
  const [animalFilter, setAnimalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <section id="search" className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500 mb-2">
            Find & Reunite
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Search Lost & Found Pets
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Search our database of lost and found pets. Every search brings a pet closer to home.
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8 space-y-6">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                placeholder="Search by name, breed, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:text-orange-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="reunited">Reunited</option>
            </select>

            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white"
              value={animalFilter}
              onChange={(e) => setAnimalFilter(e.target.value)}
            >
              <option value="">All Animals</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="other">Other</option>
            </select>

            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
            </select>

            <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">
              Advanced Filters
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeView === 'grid'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveView('grid')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Grid
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveView('map')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            Map
          </button>
        </div>

        {/* Grid View */}
        {activeView === 'grid' && (
          <div id="grid-view" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Lost Pet Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <div className="aspect-[4/3] relative bg-gray-200">
                  <Image
                    src="/images/golden-retriever.jpg"
                    alt="Max"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    LOST
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                    URGENT
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Max</h3>
                <p className="text-sm text-gray-600">
                  Golden Retriever • Male • 3 years
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Central Park, Delhi
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    Missing for 4 days
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                    Medical Needs
                  </span>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                    Microchipped
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition-colors">
                    Contact Owner
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">
                    Share Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Found Pet Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <div className="aspect-[4/3] relative bg-gray-200">
                  <Image
                    src="/images/persian-cat.jpg"
                    alt="Persian Cat"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    FOUND
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Persian Cat</h3>
                <p className="text-sm text-gray-600">
                  Persian • Female • ~2 years
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Connaught Place, Delhi
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    Found 2 days ago
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                    Good Health
                  </span>
                  <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full border border-purple-200">
                    Well-Groomed
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition-colors">
                    Contact Finder
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">
                    Is This My Pet?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {activeView === 'map' && (
          <div id="map-view" className="bg-white rounded-2xl shadow-md p-8 lg:p-12">
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Interactive Map View
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  View lost and found pet locations on an interactive map to find pets near you.
                </p>
              </div>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold shadow-sm transition-colors">
                Enable Location Services
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
