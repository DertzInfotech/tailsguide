'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faArrowLeft,
  faClock,
  faPaw,
  faDirections
} from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css';

/* ---------------- MAP (Leaflet) ---------------- */

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

/* ---------------- CLINIC DATA ---------------- */
/* (Same data source as Resources page — static for now) */

const clinicsData = [
  {
    name: "Cessna Lifeline Veterinary Hospital",
    location: "Domlur",
    services: "General care, Surgery, Emergency",
  },
  {
    name: "Crown Vet",
    location: "Koramangala",
    services: "General care, Diagnostics",
  },
  {
    name: "Dr. Doodley Pet Hospital",
    location: "Jayanagar",
    services: "Emergency care, Surgery, Grooming",
    tag: "24/7",
  },
  {
    name: "Healthy Pawz Pets Veterinary Hospital",
    location: "Bangalore",
    services: "Emergency care, Wellness, Surgery",
    tag: "24/7",
  },
  {
    name: "Indira Pet Clinic 24/7",
    location: "Bangalore",
    services: "Emergency care, Surgery, Diagnostics",
    tag: "24/7",
  },
  {
    name: "Jeeva Pet Hospital",
    location: "Bangalore",
    services: "General care, Diagnostics",
  },
  {
    name: "Pets First Hospital",
    location: "Jayanagar",
    services: "General care, Surgery, Wellness",
    tag: "24/7",
  },
  {
    name: "Sanchu Animal Hospital",
    location: "Koramangala",
    services: "Emergency care, ICU, Surgery",
    tag: "24/7",
  },
  {
    name: "Vetic Animal Hospital",
    location: "Multiple locations",
    services: "Emergency care, Surgery, Diagnostics",
    tag: "24/7",
  },
];

/* ---------------- LOCATION → COORDS ---------------- */

const clinicCoords = {
  Domlur: [12.9606, 77.6376],
  Koramangala: [12.9352, 77.6245],
  Jayanagar: [12.9250, 77.5938],
  Bangalore: [12.9716, 77.5946],
  'Multiple locations': [12.9716, 77.5946],
};

/* ---------------- PAGE ---------------- */

export default function ClinicDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const clinic = clinicsData.find(c =>
    c.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') === slug
  );

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Clinic not found</h1>
        <button
          onClick={() => router.push('/resources')}
          className="text-orange-600 font-semibold"
        >
          ← Back to Clinics
        </button>
      </div>
    );
  }

  const coords = clinicCoords[clinic.location] || [12.9716, 77.5946];

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;

  return (
    <div className="bg-[#fffaf3] min-h-screen px-4 py-10 max-w-5xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => router.push('/resources')}
        className="mb-6 text-orange-600 font-semibold flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Clinics
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-2xl p-8 shadow mb-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{clinic.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {clinic.location}
            </p>
          </div>

          {clinic.tag && (
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              24/7 Available
            </span>
          )}
        </div>

        <div className="mt-6">
          <p className="font-semibold text-orange-600 mb-2">
            <FontAwesomeIcon icon={faPaw} /> Services Offered
          </p>
          <p className="text-gray-700">{clinic.services}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={directionsUrl}
            target="_blank"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDirections} />
            Get Directions
          </a>
        </div>
      </div>

      {/* MAP */}
      <div className="h-[400px] rounded-2xl overflow-hidden shadow">
        <MapContainer
          center={coords}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords} />
        </MapContainer>
      </div>
    </div>
  );
}
