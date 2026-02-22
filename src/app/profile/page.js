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

  const missingFields = REQUIRED_FIELDS.filter((f) => !profile[f]?.trim());
  const completionPercent = Math.round(
    ((REQUIRED_FIELDS.length - missingFields.length) / REQUIRED_FIELDS.length) * 100
  );

  const handleChange = (e) => {
    setSaved(false);
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, photo: reader.result });
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (missingFields.length > 0) {
      alert(`Please complete: ${missingFields.join(", ")}`);
      return;
    }
    Object.entries(profile).forEach(([key, value]) => {
      localStorage.setItem(key === "photo" ? "profilePhoto" : key, value);
    });
    localStorage.setItem("profileCompleted", "true");
    localStorage.setItem("defaultOwnerName", `${profile.firstName} ${profile.lastName}`);
    localStorage.setItem("defaultOwnerPhone", profile.phone);
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefaf5] flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="h-40 rounded-3xl bg-amber-100/50 animate-pulse mb-6" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefaf5] px-4 py-8 sm:p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-200/40">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Profile</h1>
            <p className="text-sm text-gray-500">Used when reporting lost or found pets</p>
          </div>
        </div>

        {/* Profile card: avatar + completion */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-amber-100 overflow-hidden mb-6">
          <div className="pt-8 pb-6 px-6 text-center">
            <label className="relative inline-block cursor-pointer group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-amber-100 mx-auto group-hover:ring-amber-200 transition">
                {profile.photo ? (
                  <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl">
                    🐾
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg shadow-lg group-hover:bg-amber-600 transition">
                +
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </label>
            <p className="text-sm text-amber-700 font-medium mt-3">Tap to change photo</p>

            {/* Completion ring */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center justify-between w-full max-w-xs">
                <span className="text-sm font-medium text-gray-600">Profile completion</span>
                <span className="text-sm font-bold text-amber-700">{completionPercent}%</span>
              </div>
              <div className="w-full max-w-xs h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              {missingFields.length > 0 && (
                <p className="text-xs text-amber-600">
                  Add: {missingFields.map((f) => ({ firstName: "First name", lastName: "Last name", phone: "Phone" }[f] || f)).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fields in sections */}
        <div className="space-y-5">
          <section className="bg-white/90 backdrop-blur rounded-3xl shadow-md border border-amber-50/80 p-6">
            <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📱</span> Contact
            </h2>
            <div className="space-y-4">
              <Input label="Email" name="email" value={profile.email} disabled />
              <Input label="Phone *" name="phone" value={profile.phone} onChange={handleChange} />
            </div>
          </section>

          <section className="bg-white/90 backdrop-blur rounded-3xl shadow-md border border-amber-50/80 p-6">
            <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✨</span> About you
            </h2>
            <div className="space-y-4">
              <Input label="Username" name="username" value={profile.username} disabled />
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name *" name="firstName" value={profile.firstName} onChange={handleChange} />
                <Input label="Last name *" name="lastName" value={profile.lastName} onChange={handleChange} />
              </div>
              <Input label="Age" name="age" type="number" value={profile.age} onChange={handleChange} />
            </div>
          </section>
        </div>

        {/* Save */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {saved && (
            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1.5">
              <span>✓</span> Profile saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-orange-200/40 hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border transition focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
          disabled ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-white border-amber-100"
        }`}
      />
    </div>
  );
}
