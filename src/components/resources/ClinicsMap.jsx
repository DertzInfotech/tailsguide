'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const COORDS = {
  Domlur: [12.9606, 77.6376],
  Koramangala: [12.9352, 77.6245],
  Jayanagar: [12.925, 77.5938],
  Bangalore: [12.9716, 77.5946],
  'Multiple locations': [12.9716, 77.5946],
};

export default function ClinicsMap({ clinics = [] }) {
  useEffect(() => {
    // Fix default marker icons broken by bundlers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clinics.map((c) => (
          <Marker
            key={c.name}
            position={COORDS[c.location] || COORDS.Bangalore}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.location}
              {c.tag ? (
                <>
                  <br />
                  <span>24/7</span>
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
