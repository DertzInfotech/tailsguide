'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

/* ---------------- DUMMY PET DATA (UI ONLY) ---------------- */
const dummyPet = {
  id: 4,
  petName: 'Buddy',
  breed: 'Golden Retriever',
  age: '3 Years',
  gender: 'Male',
  size: 'Large',
  primaryColor: 'Golden',
  distinctiveFeatures: 'White patch on chest',
  reportType: 'LOST',
  specialInstructions: 'Very friendly, responds to his name.',
  photoUrl: '/dog-default.png',
};

/* ---------------- PAGE ---------------- */
export default function ScanPetPage() {
  const { id } = useParams();

  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [tempOwnerName, setTempOwnerName] = useState('');
  const [tempOwnerPhone, setTempOwnerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* -------- GEO LOCATION -------- */
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported on this device.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        setLocation(loc);
        setLoadingLocation(false);
      },
      () => {
        alert('Unable to fetch location. Please enter manually.');
        setLoadingLocation(false);
      }
    );
  };

  /* -------- SUBMIT (API WIRED) -------- */
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

      const res = await fetch(
        `http://64.225.84.126:8084/api/v1/pet/${id}/scan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lastSeenLocation: location,
            tempOwnerName,
            tempOwnerPhone,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to submit scan data');
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- SUCCESS STATE -------- */
  if (submitted) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.successTitle}>Thank You ❤️</h2>
          <p style={styles.text}>
            The pet owner has been notified that <b>{dummyPet.petName}</b> was found.
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
        {/* -------- PET INFO -------- */}
        <img
          src={dummyPet.photoUrl}
          alt={dummyPet.petName}
          style={styles.image}
        />

        <h2 style={styles.petName}>{dummyPet.petName}</h2>
        <p style={styles.badge}>🚨 PET REPORTED LOST</p>

        <div style={styles.info}>
          <p><b>Breed:</b> {dummyPet.breed}</p>
          <p><b>Age:</b> {dummyPet.age}</p>
          <p><b>Gender:</b> {dummyPet.gender}</p>
          <p><b>Color:</b> {dummyPet.primaryColor}</p>
          <p><b>Features:</b> {dummyPet.distinctiveFeatures}</p>
          <p><b>Instructions:</b> {dummyPet.specialInstructions}</p>
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
