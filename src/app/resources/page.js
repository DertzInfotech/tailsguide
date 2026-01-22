'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt,
    faClinicMedical,
    faLightbulb,
    faArrowLeft,
    faMapMarkerAlt,
    faExclamationTriangle,
    faAmbulance,
    faHome,
    faSearch,
    faPaw,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

/*Map Component*/
const MapContainer = dynamic(
    () => import('react-leaflet').then(m => m.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then(m => m.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then(m => m.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then(m => m.Popup),
    { ssr: false }
);

/* =========================
   DATA
========================= */

const insuranceProviders = [
    {
        name: "New India Assurance",
        offerings: "Death (illness/accident), theft/loss, third-party liability, basic veterinary costs.",
        pricing: "Premium ~5% of sum insured",
        url: "https://www.newindia.co.in"
    },
    {
        name: "Universal Sompo",
        offerings: "Surgery, hospitalization, death cover, OPD, simple claim process.",
        pricing: "Contact for quote",
        url: "https://www.universalsompo.com"
    },
    {
        name: "Future Generali",
        offerings: "Illness, accident, surgery, OPD, long-term care, quick settlement.",
        pricing: "Age-based quote; contact online",
        url: "https://general.futuregenerali.in"
    },
];

const clinicsData = [
    { name: "Cessna Lifeline Veterinary Hospital", location: "Domlur", services: "General care, Surgery, Emergency" },
    { name: "Crown Vet", location: "Koramangala", services: "General care, Diagnostics" },
    { name: "Dr. Doodley Pet Hospital", location: "Jayanagar", services: "Emergency care, Surgery, Grooming", tag: "24/7" },
    { name: "Healthy Pawz Pets Veterinary Hospital", location: "Bangalore", services: "Emergency care, Wellness, Surgery", tag: "24/7" },
    { name: "Indira Pet Clinic 24/7", location: "Bangalore", services: "Emergency care, Surgery, Diagnostics", tag: "24/7" },
    { name: "Jeeva Pet Hospital", location: "Bangalore", services: "General care, Diagnostics" },
    { name: "Pets First Hospital", location: "Jayanagar", services: "General care, Surgery, Wellness", tag: "24/7" },
    { name: "Sanchu Animal Hospital", location: "Koramangala", services: "Emergency care, ICU, Surgery", tag: "24/7" },
    { name: "Vetic Animal Hospital", location: "Multiple locations", services: "Emergency care, Surgery, Diagnostics", tag: "24/7" },
];

/* =========================
   SUB PAGES
========================= */

const InsurancePartners = ({ onBack }) => (
    <>
        <button onClick={onBack} className="mb-6 text-orange-600 font-semibold flex items-center gap-2">
            ← Back to Resources
        </button>

        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-10 text-center mb-10 shadow-lg">
            <h1 className="text-4xl font-bold mb-2">Pet Insurance Providers</h1>
            <p>Compare Top Insurance Plans for Your Furry Friends</p>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl mb-10 flex gap-4 items-center">
            <FontAwesomeIcon icon={faPaw} className="text-4xl text-orange-500" />
            <p className="text-orange-800">
                Protect your beloved pets with comprehensive insurance coverage from trusted providers.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {insuranceProviders.map(p => (
                <div key={p.name} className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-orange-600 mb-3">{p.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{p.offerings}</p>
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-4">
                        <p className="text-xs font-semibold">PRICING</p>
                        <p className="font-bold text-orange-600">{p.pricing}</p>
                    </div>
                    <a href={p.url} target="_blank" className="block text-center bg-orange-500 text-white py-2 rounded-lg">
                        Visit Website
                    </a>
                </div>
            ))}
        </div>
    </>
);

const PetClinics = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // list | map
    const [filter247, setFilter247] = useState(false);


    const filtered = clinicsData.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.location.toLowerCase().includes(search.toLowerCase());

        const matches247 = filter247 ? c.tag === '24/7' : true;

        return matchesSearch && matches247;
    });

    const clinicCoords = {
        Domlur: [12.9606, 77.6376],
        Koramangala: [12.9352, 77.6245],
        Jayanagar: [12.9250, 77.5938],
        Bangalore: [12.9716, 77.5946],
        'Multiple locations': [12.9716, 77.5946],
    };

    return (
        <>
            <button onClick={onBack} className="mb-6 text-orange-600 font-semibold">
                ← Back to Resources
            </button>

            <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-10 text-center mb-10 shadow-lg">
                <h1 className="text-4xl font-bold mb-2">
                    <FontAwesomeIcon icon={faPaw} /> Pet Clinics in Bangalore
                </h1>
                <p>Find the best veterinary care for your pets</p>

                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by clinic name or location..."
                    className="mt-6 w-full max-w-xl mx-auto px-6 py-3 rounded-full 
             bg-white text-gray-800 
             border-2 border-orange-500 
             focus:outline-none focus:ring-2 focus:ring-white"
                />
            </div>

            <p className="text-center text-gray-600 mb-6">
                Showing {filtered.length} clinic(s)
            </p>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg font-semibold ${viewMode === 'list'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200'
                            }`}
                    >
                        List View
                    </button>

                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-lg font-semibold ${viewMode === 'map'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200'
                            }`}
                    >
                        Map View
                    </button>
                </div>



                <button
                    onClick={() => setFilter247(prev => !prev)}
                    className={`px-4 py-2 rounded-lg font-semibold ${filter247
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-200'
                        }`}
                >
                    24/7 Available
                </button>
            </div>

            {viewMode === 'list' && (
                <div className="grid md:grid-cols-3 gap-8">
                    {filtered.map(c => (
                        <div key={c.name} className="bg-white rounded-2xl shadow p-6 relative">
                            {c.tag && (
                                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                                    24/7
                                </span>
                            )}

                            <h3 className="font-bold text-lg mb-1">{c.name}</h3>

                            <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {c.location}
                            </p>

                            <p className="text-sm text-gray-700">
                                <span className="text-orange-500 font-semibold">Services:</span><br />
                                {c.services}
                            </p>

                            <a
                                href={`/clinics/${c.name
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9-]/g, '')}`}
                                className="mt-4 block w-full bg-gray-200 py-2 rounded-lg font-semibold text-center"
                            >
                                View Details
                            </a>
                        </div>
                    ))}
                </div>
            )}
            {viewMode === 'map' && (
                <div className="h-[500px] rounded-xl overflow-hidden">
                    <MapContainer
                        center={[12.9716, 77.5946]}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {filtered.map(c => (
                            <Marker
                                key={c.name}
                                position={clinicCoords[c.location] || [12.9716, 77.5946]}
                            >
                                <Popup>
                                    <strong>{c.name}</strong><br />
                                    {c.location}<br />
                                    {c.tag && <span>24/7</span>}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

        </>
    );
};

const PreventionTips = ({ onBack }) => (
    <>
        <button onClick={onBack} className="mb-6 text-orange-600 font-semibold">
            ← Back to Resources
        </button>

        <div className="bg-orange-50 rounded-2xl p-10 text-center mb-12">
            <h1 className="text-3xl font-bold text-orange-600 mb-2">
                Pet Safety & Prevention Tips
            </h1>
            <p className="text-gray-700">
                Proactive steps are the best way to keep your pet safe.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-orange-600 font-bold mb-2">Secure Your Home & Yard</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Check fences and gates</li>
                    <li>Secure window screens</li>
                    <li>Be cautious with open doors</li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-orange-600 font-bold mb-2">Identification is Key</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Use ID tags</li>
                    <li>Microchip your pet</li>
                    <li>Consider GPS tracking</li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-orange-600 font-bold mb-2">Training & Leash Safety</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Train recall commands</li>
                    <li>Always use a leash</li>
                    <li>Check harness fit</li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-orange-600 font-bold mb-2">Be Prepared</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Keep recent photos</li>
                    <li>Emergency contacts list</li>
                    <li>Prepare a lost pet flyer</li>
                </ul>
            </div>
        </div>
    </>
);

/* =========================
   MAIN GRID
========================= */

const MainResourcesGrid = ({ onNavigate }) => (
    <>
        <h1 className="text-4xl font-bold mb-10">Resources & Support</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
            <button onClick={() => onNavigate('insurance')} className="bg-white p-6 rounded-xl shadow text-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-orange-500 mb-4" />
                <h3 className="font-bold">Insurance Partners</h3>
            </button>

            <button onClick={() => onNavigate('clinics')} className="bg-white p-6 rounded-xl shadow text-center">
                <FontAwesomeIcon icon={faClinicMedical} className="text-4xl text-orange-500 mb-4" />
                <h3 className="font-bold">Pet Clinics</h3>
            </button>

            <button onClick={() => onNavigate('prevention')} className="bg-white p-6 rounded-xl shadow text-center">
                <FontAwesomeIcon icon={faLightbulb} className="text-4xl text-orange-500 mb-4" />
                <h3 className="font-bold">Prevention Tips</h3>
            </button>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6">Emergency Support</h2>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl mb-2" />
                <h4 className="font-bold text-red-800">Animal Emergency Helpline</h4>
                <p className="text-red-700 font-semibold text-xl">1-800-PET-HELP</p>
                <p className="text-sm text-red-700">24/7 emergency support.</p>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded-lg">
                <FontAwesomeIcon icon={faAmbulance} className="text-blue-600 text-2xl mb-2" />
                <h4 className="font-bold text-blue-800">Mobile Veterinary Services</h4>
                <p className="text-sm text-blue-700 mb-2">On-site emergency care.</p>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg">Request Service</button>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-lg">
                <FontAwesomeIcon icon={faHome} className="text-green-600 text-2xl mb-2" />
                <h4 className="font-bold text-green-800">Temporary Foster Network</h4>
                <p className="text-sm text-green-700 mb-2">Emergency foster care.</p>
                <button className="bg-green-500 text-white px-4 py-1 rounded-lg">Find Foster</button>
            </div>
        </div>
    </>
);

/* =========================
   MAIN
========================= */

export default function Resources() {
    const [view, setView] = useState('main');

    useEffect(() => window.scrollTo(0, 0), [view]);

    return (
        <div className="bg-[#fffaf3] min-h-screen px-4 py-12 max-w-7xl mx-auto">
            {view === 'main' && <MainResourcesGrid onNavigate={setView} />}
            {view === 'insurance' && <InsurancePartners onBack={() => setView('main')} />}
            {view === 'clinics' && <PetClinics onBack={() => setView('main')} />}
            {view === 'prevention' && <PreventionTips onBack={() => setView('main')} />}
        </div>
    );
}
