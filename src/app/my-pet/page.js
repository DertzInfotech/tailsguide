"use client";

import { useEffect, useState } from "react";
import { getMyPets, reportPet, deletePet } from "@/api/petApi";
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

  const [brokenImages, setBrokenImages] = useState({});

  const [openMenuId, setOpenMenuId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  /* ---------- DELETE PET ---------- */
const confirmDelete = async () => {
  if (!petToDelete) return;

  try {
    setDeleting(true);

    const res = await deletePet(petToDelete.id);
    console.log("DELETE RESPONSE:", res);

    setPets((prev) => prev.filter((p) => p.id !== petToDelete.id));
    setShowDeleteModal(false);
    setPetToDelete(null);
  } catch (err) {
    console.error("DELETE ERROR FULL:", err);

    if (err.response) {
      console.error("STATUS:", err.response.status);
      console.error("DATA:", err.response.data);
    } else {
      console.error("NO RESPONSE FROM SERVER");
    }

    alert(
      err.response?.data?.message ||
      "Delete failed (check console for details)"
    );
  } finally {
    setDeleting(false);
  }
};


  if (loading) return <p className="p-6">Loading pets...</p>;

  return (
    <div className="min-h-screen p-6 bg-[#f7f3ee]">
      <h1 className="text-2xl font-bold mb-1">My Pets 🐾</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage and update your pets’ profiles
      </p>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2 rounded-xl bg-green-500 text-white mb-6 shadow-sm"
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

          const imageUrl = pet.thumbnailUrl || pet.photoUrl;
          const hasValidImage =
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "null" &&
            imageUrl !== "undefined" &&
            !brokenImages[pet.id];

          return (
            <div
              key={pet.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center relative"
            >
              {/* LEFT */}
              <div className="flex items-center gap-5">
                {/* AVATAR */}
                <div
                  onClick={() => {
                    if (!hasValidImage) {
                      router.push(`/edit-pet/${pet.id}`);
                    }
                  }}
                  className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center
                    ${
                      hasValidImage
                        ? "ring-2 ring-offset-2 ring-offset-white bg-gradient-to-br from-emerald-400 to-emerald-600"
                        : "border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer"
                    }`}
                >
                  {hasValidImage ? (
                    <img
                      src={`http://64.225.84.126:8084/api/v1${imageUrl}`}
                      className="w-full h-full object-cover"
                      onError={() =>
                        setBrokenImages((p) => ({ ...p, [pet.id]: true }))
                      }
                    />
                  ) : (
                    <span className="text-2xl text-gray-400">📷</span>
                  )}
                </div>

                <div>
                  <p className="font-medium text-lg">{pet.petName}</p>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                  <p
                    className={`text-sm mt-1 ${
                      isComplete
                        ? "text-emerald-600"
                        : "text-orange-600"
                    }`}
                  >
                    {isComplete ? "✓ Complete" : "⚠ Incomplete"}
                  </p>
                </div>
              </div>

              {/* 3 DOT MENU */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === pet.id ? null : pet.id)
                  }
                  className="px-2 py-1 rounded hover:bg-gray-100"
                >
                  ⋯
                </button>

                {openMenuId === pet.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={() => router.push(`/edit-pet/${pet.id}`)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit profile
                    </button>

                    <button
                      onClick={() => {
                        setPetToDelete(pet);
                        setShowDeleteModal(true);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete pet
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && petToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Delete “{petToDelete.petName}”?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600"
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete pet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
