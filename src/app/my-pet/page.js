"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getMyPets, deletePet, getPetSightings, getPetCollarQr } from "@/api/petApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ---------- PROFILE COMPLETENESS CHECK ---------- */
const getMissingProfileFields = (pet) => {
  const missing = [];

  if (!pet.petName) missing.push("Pet name");
  if (!pet.breed) missing.push("Breed");
  if (!pet.gender) missing.push("Gender");
  if (!pet.size) missing.push("Size");
  if (!pet.primaryColor) missing.push("Color");
  if (!pet.distinctiveFeatures) missing.push("Distinctive marks");
  if (!pet.lastSeenLocation) missing.push("Location");
  if (!pet.ownerName) missing.push("Owner name");
  if (!pet.ownerPhone) missing.push("Phone number");

  return missing;
};

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [addReportType, setAddReportType] = useState("REGISTERED");
  const [addFoundLocation, setAddFoundLocation] = useState("");
  const [addFoundDate, setAddFoundDate] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null); // { bottom, right } for fixed dropdown

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- QR STATE (NEW) ---------- */
  const [qrLoading, setQrLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrPetName, setQrPetName] = useState("");

  /* ---------- SIGHTINGS (someone spotted your lost pet) ---------- */
  const [sightingsByPetId, setSightingsByPetId] = useState({});

  const router = useRouter();

  /* ---------- FETCH PETS ---------- */
  const fetchPets = async () => {
    try {
      const res = await getMyPets();
      setPets(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to load pets", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CLOSE DROPDOWN ON SCROLL ---------- */
  useEffect(() => {
    if (!openMenuId) return;
    const close = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [openMenuId]);

  /* ---------- FETCH SIGHTINGS FOR LOST PETS ---------- */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const list = await fetchPets();
      if (cancelled || !list.length) return;
      const lost = list.filter((p) => p.reportType === "LOST");
      const byId = {};
      await Promise.all(
        lost.map(async (p) => {
          try {
            const res = await getPetSightings(p.id);
            const data = res.data;
            byId[p.id] = Array.isArray(data) ? data : data?.content ? data.content : data?.sightings ? data.sightings : [];
          } catch {
            byId[p.id] = [];
          }
        })
      );
      if (!cancelled) setSightingsByPetId((prev) => ({ ...prev, ...byId }));
    };
    run();
    return () => { cancelled = true; };
  }, []);

  /* ---------- ADD PET ---------- */
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const handleAddPet = async (e) => {
    e?.preventDefault();
    if (!petName.trim()) {
      setAddError("Please enter a pet name");
      return;
    }
    if (addReportType === "FOUND") {
      if (!addFoundLocation.trim()) {
        setAddError("Please enter where the pet was found");
        return;
      }
      if (!addFoundDate) {
        setAddError("Please enter the date found");
        return;
      }
    }
    setAddError(null);
    setAdding(true);
    try {
      // Email and phone from profile (updated there); fallback to signup/signin values
      const ownerEmail =
        localStorage.getItem("email") || localStorage.getItem("userEmail") || "";
      const ownerPhone =
        localStorage.getItem("phone") ||
        localStorage.getItem("defaultOwnerPhone") ||
        localStorage.getItem("userMobile") ||
        "";

      const formData = new FormData();
      const petDTO = {
        petName: petName.trim(),
        breed: breed.trim() || null,
        reportType: addReportType,
        ownerEmail,
        ownerPhone,
      };
      if (addReportType === "FOUND") {
        petDTO.lastSeenLocation = addFoundLocation.trim() || null;
        petDTO.lastSeenDate = addFoundDate || null;
      }
      formData.append("petDTO", new Blob([JSON.stringify(petDTO)], { type: "application/json" }));
      // No photo for quick add; user can add photo in Edit

      const res = await fetch("/api/v1/pet/report", {
        method: "POST",
        body: formData,
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setPetName("");
        setBreed("");
        setAddReportType("REGISTERED");
        setAddFoundLocation("");
        setAddFoundDate("");
        setShowForm(false);
        fetchPets();
      } else {
        const msg = result.businessErrorDescription || result.message || result.validationErrors || "Failed to add pet";
        setAddError(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
    } catch (err) {
      console.error("Failed to add pet", err);
      setAddError("Failed to add pet. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  /* ---------- DELETE PET ---------- */
  const confirmDelete = async () => {
    if (!petToDelete) return;

    try {
      setDeleting(true);
      await deletePet(petToDelete.id);
      setPets((prev) => prev.filter((p) => p.id !== petToDelete.id));
      setShowDeleteModal(false);
      setPetToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- GENERATE QR (NEW) ---------- */
  const handleGenerateQR = async (pet) => {
    try {
      setQrLoading(true);
      setQrPetName(pet.petName);

      const res = await getPetCollarQr(pet.id);
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR code");
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/80" />
        <div className="relative z-10 px-4 py-8 sm:p-6">
          <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-200/50 animate-pulse" />
              <div>
                <div className="h-8 w-28 bg-amber-100 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white/80 border border-amber-50 animate-pulse max-w-[200px] sm:max-w-[220px] w-full" />
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }} />
      {/* Unique background: gradient + pattern + soft orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/80" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "url('/paw-pattern.png')", backgroundRepeat: "repeat", backgroundSize: "280px 280px" }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-200/15 blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white/75 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-amber-900/5 border border-white/80 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-amber-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-300/40 ring-2 ring-white/50">
              🐾
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
                My Pets
              </h1>
              <p className="text-amber-800/70 mt-1 text-sm font-medium">
                Your furry family, all in one place
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fa7c15] to-amber-500 text-white font-semibold shadow-lg shadow-orange-300/40 hover:shadow-xl hover:shadow-orange-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <span className="text-xl leading-none">+</span>
            Add Pet
          </button>
        </div>

        {/* Add Pet Form */}
        {showForm && (
          <form
            onSubmit={handleAddPet}
            className="bg-white/90 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-100 mb-8 [animation:cardIn_0.3s_ease-out_both]"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-semibold text-gray-800">Add new pet</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Start with a name; you can add photos and details in the profile.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label htmlFor="add-pet-name" className="block text-sm font-medium text-gray-700 mb-1.5">Pet name *</label>
                <input
                  id="add-pet-name"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Max"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>
              <div>
                <label htmlFor="add-pet-breed" className="block text-sm font-medium text-gray-700 mb-1.5">Breed</label>
                <input
                  id="add-pet-breed"
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Labrador"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Report type</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "REGISTERED", label: "Register", desc: "Register your pet" },
                  { value: "LOST", label: "Lost", desc: "Pet is lost" },
                  { value: "FOUND", label: "Found", desc: "Pet is found" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition ${
                      addReportType === opt.value
                        ? "border-orange-500 bg-orange-50 text-orange-800"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="add-report-type"
                      value={opt.value}
                      checked={addReportType === opt.value}
                      onChange={() => setAddReportType(opt.value)}
                      className="sr-only"
                    />
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">— {opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>
            {addReportType === "FOUND" && (
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label htmlFor="add-found-location" className="block text-sm font-medium text-gray-700 mb-1.5">Where was the pet found? *</label>
                  <input
                    id="add-found-location"
                    type="text"
                    value={addFoundLocation}
                    onChange={(e) => setAddFoundLocation(e.target.value)}
                    placeholder="e.g. Indiranagar, near Metro"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  />
                </div>
                <div>
                  <label htmlFor="add-found-date" className="block text-sm font-medium text-gray-700 mb-1.5">Date found *</label>
                  <input
                    id="add-found-date"
                    type="date"
                    value={addFoundDate}
                    onChange={(e) => setAddFoundDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  />
                </div>
              </div>
            )}
            {addError && (
              <p className="text-sm text-red-600 mb-4 bg-red-50 px-3 py-2 rounded-lg">{addError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setAddError(null); setAddReportType("REGISTERED"); setAddFoundLocation(""); setAddFoundDate(""); }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="px-5 py-2.5 rounded-xl bg-[#fa7c15] text-white font-semibold hover:bg-[#e96e0c] disabled:opacity-60 transition"
              >
                {adding ? "Adding…" : "Add pet"}
              </button>
            </div>
          </form>
        )}

        {/* Pet grid or empty state */}
        {pets.length === 0 ? (
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-amber-100 p-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-5xl mb-5 shadow-inner">
              🐕
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No pets yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Add your first pet to build their profile, add photos, and keep their info safe for reunites.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fa7c15] to-amber-500 text-white font-semibold shadow-lg shadow-orange-200/40 hover:shadow-xl transition"
            >
              <span className="text-xl">+</span> Add your first pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5 justify-items-center">
            {pets.map((pet, index) => {
              const missing = getMissingProfileFields(pet);
              const isComplete = missing.length === 0;
              const thumbnailUrl = pet.thumbnailUrl
                ? `/api/v1${pet.thumbnailUrl.startsWith("/") ? pet.thumbnailUrl : `/${pet.thumbnailUrl}`}?ts=${pet.updatedAt || Date.now()}`
                : `/api/v1/pet/${pet.id}/thumbnail?ts=${pet.updatedAt || Date.now()}`;
              const sightings = sightingsByPetId[pet.id] || [];
              const hasSightings = pet.reportType === "LOST" && sightings.length > 0;
              const isLost = pet.reportType === "LOST";

              return (
                <div key={pet.id} className="w-full max-w-[180px] sm:max-w-[200px] flex flex-col items-center gap-3">
                <div
                  className="group relative w-full rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-white/80 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 [animation:cardIn_0.35s_ease-out_both]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Photo + overlay */}
                  <button
                    type="button"
                    onClick={() => router.push(`/edit-pet/${pet.id}`)}
                    className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-inset rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-linear-to-br from-amber-100 to-orange-100">
                      <img
                        src={thumbnailUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onLoad={(e) => {
                          const next = e.currentTarget.nextElementSibling;
                          if (next) next.classList.add("hidden");
                        }}
                        onError={(e) => {
                          e.currentTarget.classList.add("hidden");
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-5xl text-amber-200/70">🐕</span>
                      {/* Bottom gradient + frosted bar */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 bg-white/15 backdrop-blur-md border-t border-white/20 p-3">
                        <p className="font-bold text-white text-base truncate drop-shadow-md">{pet.petName}</p>
                        <p className="text-white/95 text-xs truncate mt-0.5">{pet.breed || "—"}</p>
                        <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold ${isComplete ? "text-emerald-200" : "text-amber-200"}`}>
                          {isComplete ? "✓ Complete" : `${missing.length} to go`}
                        </span>
                      </div>
                      {/* Status badge: pill with left accent */}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                          isLost
                            ? "bg-amber-500/95 text-white border-l-2 border-amber-300"
                            : "bg-emerald-500/95 text-white border-l-2 border-emerald-300"
                        }`}
                      >
                        {isLost ? "Lost" : "Found"}
                      </span>
                    </div>
                  </button>

                  {/* View profile on card */}
                  <div className="px-3 py-2 bg-amber-50/80 border-t border-amber-100/80">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); router.push(`/my-pet/${pet.id}/profile`); }}
                      className="w-full text-center text-xs font-semibold text-amber-700 hover:text-amber-800 py-1.5 rounded-lg hover:bg-amber-100/80 transition-colors"
                    >
                      View profile →
                    </button>
                  </div>

                  {/* Action: menu */}
                  <div className="absolute top-2.5 right-2.5 flex items-center justify-end z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openMenuId === pet.id) {
                          setOpenMenuId(null);
                          setMenuPosition(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            bottom: window.innerHeight - rect.top + 6,
                            right: window.innerWidth - rect.right,
                          });
                          setOpenMenuId(pet.id);
                        }
                      }}
                      className="p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 text-gray-600 transition-all duration-200"
                      aria-label="More options"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Sighting alert */}
                {hasSightings && (
                  <Link
                    href={`/my-pet/${pet.id}/sightings`}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-800 text-xs font-semibold hover:bg-amber-500/25 hover:border-amber-500/60 transition-all"
                  >
                    Someone spotted your pet — view details ({sightings.length})
                  </Link>
                )}
                </div>
              );
            })}
            {/* Add pet card */}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex flex-col items-center justify-center aspect-4/5 w-full max-w-[180px] sm:max-w-[200px] rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/60 hover:bg-amber-100/80 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group/add"
            >
              <span className="text-5xl text-amber-400 group-hover/add:scale-110 transition-transform">+</span>
              <span className="text-sm font-semibold text-amber-700 mt-2">Add pet</span>
            </button>
          </div>
        )}

        {/* Dropdown portal */}
        {typeof document !== "undefined" &&
          openMenuId &&
          menuPosition &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setOpenMenuId(null);
                  setMenuPosition(null);
                }}
                aria-hidden="true"
              />
              <div
                className="fixed z-50 w-52 bg-white rounded-xl shadow-xl border border-amber-100/80 py-1.5 animate-[dropdownIn_0.25s_ease-out_both]"
                style={{
                  bottom: menuPosition.bottom,
                  right: menuPosition.right,
                }}
              >
                {(() => {
                  const pet = pets.find((p) => p.id === openMenuId);
                  if (!pet) return null;
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setMenuPosition(null);
                          router.push(`/edit-pet/${pet.id}`);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition"
                      >
                        <span aria-hidden>✏️</span> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setMenuPosition(null);
                          handleGenerateQR(pet);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition"
                      >
                        <span aria-hidden>📱</span> Generate QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setMenuPosition(null);
                          router.push(`/my-pet/${pet.id}/medical`);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition"
                      >
                        <span aria-hidden>📋</span> Medical records
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPetToDelete(pet);
                          setShowDeleteModal(true);
                          setOpenMenuId(null);
                          setMenuPosition(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <span aria-hidden>🗑️</span> Delete pet
                      </button>
                    </>
                  );
                })()}
              </div>
            </>,
            document.body
          )}
        </div>

        {/* QR Modal */}
        {qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-[fadeIn_0.2s_ease-out]" onClick={() => setQrUrl(null)}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 [animation:modalIn_0.25s_ease-out_both]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">QR Code for {qrPetName}</h2>
              <p className="text-sm text-gray-500 mb-6">Attach this to your pet’s collar so others can help reunite.</p>
              {qrLoading ? (
                <div className="py-8 text-center text-gray-500">Generating QR…</div>
              ) : (
                <div className="flex flex-col gap-3">
                  <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-xl bg-blue-500 text-white text-center font-medium hover:bg-blue-600 transition">
                    Preview QR
                  </a>
                  <a href={qrUrl} download={`pet-${qrPetName}-qr.pdf`} className="px-4 py-3 rounded-xl bg-[#fa7c15] text-white text-center font-medium hover:bg-[#e96e0c] transition">
                    Download QR
                  </a>
                </div>
              )}
              <button type="button" onClick={() => setQrUrl(null)} className="mt-6 w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && petToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-[fadeIn_0.2s_ease-out]" onClick={() => !deleting && setShowDeleteModal(false)}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 [animation:modalIn_0.25s_ease-out_both]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete “{petToDelete.petName}”?</h2>
              <p className="text-gray-500 text-sm mb-6">This will permanently remove this pet’s profile. This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {deleting ? "Deleting…" : "Delete pet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
