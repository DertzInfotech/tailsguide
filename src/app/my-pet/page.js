"use client";

import { useEffect, useState } from "react";
import { getMyPets, reportPet } from "@/api/petApi";
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
  if (!pet.photoUrl && !pet.thumbnailUrl) missing.push("Pet photo");

  return missing;
};

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  // 🔑 track broken images per pet
  const [brokenImages, setBrokenImages] = useState({});

  const router = useRouter();

  /* ---------- FETCH PETS ---------- */
  const fetchPets = async () => {
    try {
      const response = await getMyPets();
      setPets(response.data);
    } catch (error) {
      console.error("Failed to load pets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  /* ---------- ADD PET ---------- */
  const handleAddPet = async () => {
    if (!petName.trim()) return;

    try {
      const ownerEmail = localStorage.getItem("userEmail");
      const ownerPhone = localStorage.getItem("userMobile");

      await reportPet({
        petName,
        breed,
        reportType: "LOST",
        ownerEmail,
        ownerPhone,
      });

      setPetName("");
      setBreed("");
      setShowForm(false);
      fetchPets();
    } catch (error) {
      console.error("Failed to add pet", error);
      alert("Failed to add pet");
    }
  };

  if (loading) return <p className="p-6">Loading pets...</p>;

  return (
    <div className="min-h-screen p-6 bg-[#f7f3ee]">
      <h1 className="text-2xl font-bold mb-6">My Pets 🐾</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2 rounded-xl bg-green-500 text-white mb-6"
      >
        + Add Pet
      </button>

      {showForm && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow">
          <input
            placeholder="Pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <input
            placeholder="Breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <button
            onClick={handleAddPet}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            Save Pet
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {pets.map((pet) => {
          const missing = getMissingProfileFields(pet);
          const isComplete = missing.length === 0;
console.log("PET IMAGE URL:", pet.photoUrl, pet.thumbnailUrl);
          const imageUrl = pet.thumbnailUrl || pet.photoUrl;
          const hasValidImage =
            imageUrl &&
            imageUrl !== "null" &&
            imageUrl !== "undefined" &&
            !brokenImages[pet.id];
            console.log("HAS VALID IMAGE?", pet.id, hasValidImage);

          return (
            <div
              key={pet.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                {/* IMAGE / PLACEHOLDER */}
                <div
                  onClick={() => {
                    if (!hasValidImage) {
                      router.push(`/edit-pet/${pet.id}`);
                    }
                  }}
                  className={`w-14 h-14 rounded-full border overflow-hidden
                    flex items-center justify-center
                    ${
                      hasValidImage
                        ? "cursor-default"
                        : "cursor-pointer bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {hasValidImage ? (
                    <img
                      src={`http://64.225.84.126:8084${imageUrl}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [pet.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 text-[10px] leading-tight">
                      <span className="text-lg">📷</span>
                      <span>No image</span>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div>
                  <p className="font-medium">{pet.petName}</p>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                  <span
                    className={`text-xs font-medium ${
                      isComplete ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {isComplete ? "Profile Complete" : "Profile Incomplete"}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/edit-pet/${pet.id}`)}
                  className="px-3 py-1 text-sm rounded bg-gray-200"
                >
                  Edit
                </button>

                {!isComplete && (
                  <button
                    onClick={() => {
                      setMissingFields(missing);
                      setSelectedPetId(pet.id);
                      setShowCompleteModal(true);
                    }}
                    className="px-3 py-1 text-sm rounded bg-orange-500 text-white"
                  >
                    Complete Profile
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLETE PROFILE MODAL */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">
              Complete Pet Profile
            </h2>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5">
              <p className="text-sm font-medium text-orange-700 mb-2">
                Missing information
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-orange-800">
                {missingFields.map((field, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  router.push(`/edit-pet/${selectedPetId}`);
                }}
                className="px-5 py-2 rounded-lg text-sm bg-green-500 text-white"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
