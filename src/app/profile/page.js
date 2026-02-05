"use client";

import { useEffect, useState } from "react";

const REQUIRED_FIELDS = ["firstName", "lastName", "phone"];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    username: "",
    firstName: "",
    lastName: "",
    age: "",
    photo: "",
  });

  /* ---------- LOAD FROM LOCAL STORAGE ---------- */
  useEffect(() => {
    setProfile({
      email: localStorage.getItem("userEmail") || "",
      phone: localStorage.getItem("userMobile") || "",
      username: localStorage.getItem("userEmail") || "",
      firstName: localStorage.getItem("firstName") || "",
      lastName: localStorage.getItem("lastName") || "",
      age: localStorage.getItem("age") || "",
      photo: localStorage.getItem("profilePhoto") || "",
    });

    setLoading(false);
  }, []);

  /* ---------- PROFILE COMPLETION ---------- */
  const missingFields = REQUIRED_FIELDS.filter(
    (f) => !profile[f]?.trim()
  );
  const completionPercent = Math.round(
    ((REQUIRED_FIELDS.length - missingFields.length) /
      REQUIRED_FIELDS.length) *
      100
  );

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e) => {
    setSaved(false);
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ---------- PHOTO UPLOAD ---------- */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, photo: reader.result });
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ---------- SAVE PROFILE ---------- */
  const handleSave = () => {
    if (missingFields.length > 0) {
      alert(`Please complete: ${missingFields.join(", ")}`);
      return;
    }

    Object.entries(profile).forEach(([key, value]) => {
      localStorage.setItem(key === "photo" ? "profilePhoto" : key, value);
    });

    localStorage.setItem("profileCompleted", "true");

    // 🔁 SYNC → PET OWNER DEFAULTS
    localStorage.setItem("defaultOwnerName", `${profile.firstName} ${profile.lastName}`);
    localStorage.setItem("defaultOwnerPhone", profile.phone);

    setSaved(true);
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#f7f3ee] p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-semibold mb-2">My Profile</h1>

        {/* COMPLETION STATUS */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {missingFields.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">
              Missing: {missingFields.join(", ")}
            </p>
          )}
        </div>

        {/* PROFILE PHOTO */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center">
            {profile.photo ? (
              <img src={profile.photo} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">📷 Upload</span>
            )}
          </div>

          <label className="cursor-pointer text-sm text-green-600">
            Change Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>

        <Input label="Email" name="email" value={profile.email} disabled />
        <Input label="Username" value={profile.username} disabled />
        <Input label="Phone *" name="phone" value={profile.phone} onChange={handleChange} />
        <Input label="First Name *" name="firstName" value={profile.firstName} onChange={handleChange} />
        <Input label="Last Name *" name="lastName" value={profile.lastName} onChange={handleChange} />
        <Input label="Age" name="age" type="number" value={profile.age} onChange={handleChange} />

        <div className="flex justify-between items-center mt-6">
          {saved && <span className="text-green-600 text-sm">Profile saved</span>}
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-green-500 text-white"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- INPUT ---------- */
function Input({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full p-3 rounded-xl border ${
          disabled ? "bg-gray-100" : "bg-white"
        }`}
      />
    </div>
  );
}
