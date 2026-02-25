'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPetById, postPetScan } from '@/api/petApi';

const getThumbnailUrl = (petId) => `/api/v1/pet/${petId}/thumbnail`;

/* ---------------- PAGE ---------------- */
export default function ScanPetPage() {
  const { id } = useParams();

  const [pet, setPet] = useState(null);
  const [petLoading, setPetLoading] = useState(true);
  const [petError, setPetError] = useState(null);

  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [tempOwnerName, setTempOwnerName] = useState('');
  const [tempOwnerPhone, setTempOwnerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) {
      setPetLoading(false);
      return;
    }
    let cancelled = false;
    getPetById(id)
      .then((res) => {
        if (!cancelled) setPet(res.data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setPetError('Could not load pet details.');
      })
      .finally(() => {
        if (!cancelled) setPetLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  /* -------- GEO LOCATION -------- */
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported on this device.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
        setLoadingLocation(false);
      },
      () => {
        alert('Unable to fetch location. Please enter manually.');
        setLoadingLocation(false);
      }
    );
  };

  /* -------- SUBMIT (POST /pet/{id}/scan) -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert('Please provide the location where you found the pet.');
      return;
    }

    if (!tempOwnerName || !tempOwnerPhone) {
      alert('Please enter your name and phone number.');
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        lastSeenLocation: location,
        tempOwnerName,
        tempOwnerPhone,
      };
      const latMatch = location.match(/Latitude:\s*([-\d.]+)/i);
      const lngMatch = location.match(/Longitude:\s*([-\d.]+)/i);
      const lat = latMatch ? parseFloat(latMatch[1]) : null;
      const lng = lngMatch ? parseFloat(lngMatch[1]) : null;
      if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
        body.additionalProp1 = lat;
        body.additionalProp2 = lng;
        body.additionalProp3 = 0.1;
      }

      await postPetScan(id, body);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data?.businessErrorDescription;
      alert(msg || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- LOADING / ERROR -------- */
  if (petLoading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.skeletonImage} />
          <div style={{ height: 24, background: '#eee', borderRadius: 8, marginTop: 12, maxWidth: 200, margin: '12px auto 0' }} />
          <p style={styles.text}>Loading pet details…</p>
        </div>
      </div>
    );
  }

  if (petError || !pet) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.petName}>Pet not found</h2>
          <p style={styles.text}>{petError || 'This pet could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  /* -------- SUCCESS STATE -------- */
  if (submitted) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.successTitle}>Thank You ❤️</h2>
          <p style={styles.text}>
            The pet owner has been notified that <b>{pet.petName || 'this pet'}</b> was found.
          </p>
          <p style={styles.text}>
            Please keep your phone available in case the owner contacts you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* -------- PET INFO (from API) -------- */}
        <img
          src={getThumbnailUrl(pet.id)}
          alt={pet.petName || 'Pet'}
          style={styles.image}
          onError={(e) => { e.target.src = '/dog-default.png'; }}
        />

        <h2 style={styles.petName}>{pet.petName || 'Unknown'}</h2>
        <p style={styles.badge}>🚨 PET REPORTED LOST</p>

        <div style={styles.info}>
          {pet.breed && <p><b>Breed:</b> {pet.breed}</p>}
          {pet.age && <p><b>Age:</b> {pet.age}</p>}
          {pet.gender && <p><b>Gender:</b> {pet.gender}</p>}
          {pet.primaryColor && <p><b>Color:</b> {pet.primaryColor}</p>}
          {pet.distinctiveFeatures && <p><b>Features:</b> {pet.distinctiveFeatures}</p>}
          {pet.specialInstructions && <p><b>Instructions:</b> {pet.specialInstructions}</p>}
        </div>

        {/* -------- FORM -------- */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.sectionTitle}>📍 Where did you find this pet?</h3>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            style={styles.locationBtn}
            disabled={loadingLocation}
          >
            {loadingLocation ? 'Fetching location…' : 'Use my current location'}
          </button>

          <textarea
            placeholder="Or enter location manually (Google Maps link or address)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.textarea}
          />

          <div style={styles.helpBox}>
            <b>Need help finding your location?</b>
            <ul>
              <li>Open Google Maps</li>
              <li>Long-press on your current spot</li>
              <li>Copy the location link</li>
              <li>Paste it above</li>
            </ul>
          </div>

          <h3 style={styles.sectionTitle}>👤 Your Details</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={tempOwnerName}
            onChange={(e) => setTempOwnerName(e.target.value)}
            style={styles.input}
          />

          <input
            type="tel"
            placeholder="Your Phone Number"
            value={tempOwnerPhone}
            onChange={(e) => setTempOwnerPhone(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.7 : 1,
            }}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'I Found This Pet'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f6f7fb',
    display: 'flex',
    justifyContent: 'center',
    padding: '16px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  skeletonImage: {
    width: '100%',
    height: '220px',
    borderRadius: '12px',
    background: '#e5e7eb',
  },
  petName: {
    marginTop: '12px',
    marginBottom: '4px',
    textAlign: 'center',
  },
  badge: {
    textAlign: 'center',
    color: '#d9534f',
    fontWeight: '600',
    marginBottom: '12px',
  },
  info: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    marginTop: '10px',
    marginBottom: '4px',
  },
  locationBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  textarea: {
    minHeight: '70px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  helpBox: {
    background: '#f1f3f5',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  submitBtn: {
    marginTop: '10px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#28a745',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successTitle: {
    textAlign: 'center',
    color: '#28a745',
  },
  text: {
    textAlign: 'center',
    marginTop: '8px',
  },
};
