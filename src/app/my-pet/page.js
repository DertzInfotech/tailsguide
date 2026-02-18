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

  return missing;
};

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- QR STATE (NEW) ---------- */
  const [qrLoading, setQrLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrPetName, setQrPetName] = useState("");

  const router = useRouter();

  /* ---------- FETCH PETS ---------- */
  const fetchPets = async () => {
    try {
      const res = await getMyPets();
      setPets(res.data);
    } catch (err) {
      console.error("Failed to load pets", err);
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
    } catch (err) {
      console.error("Failed to add pet", err);
      alert("Failed to add pet");
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

      const res = await fetch(
        `/api/v1/pet/${pet.id}/collar-qr`
      );

      if (!res.ok) throw new Error("QR generation failed");

      const blob = await res.blob();
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
    return <p className="p-6">Loading pets...</p>;
  }

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

      {/* PET LIST */}
      <div className="grid gap-4">
        {pets.map((pet) => {
          const missing = getMissingProfileFields(pet);
          const isComplete = missing.length === 0;

          const thumbnailUrl = pet.thumbnailUrl
            ? `/api/v1${pet.thumbnailUrl.startsWith("/") ? pet.thumbnailUrl : `/${pet.thumbnailUrl}`}?ts=${pet.updatedAt || Date.now()}`
            : `/api/v1/pet/${pet.id}/thumbnail?ts=${pet.updatedAt || Date.now()}`;

          return (
            <div
              key={pet.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center relative"
            >
              {/* LEFT */}
              <div className="flex items-center gap-5">
                <div
                  onClick={() => router.push(`/edit-pet/${pet.id}`)}
                  className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center
                             border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer relative"
                >
                  <img
                    src={thumbnailUrl}
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      const camera = e.currentTarget.nextSibling;
                      if (camera) camera.style.display = "none";
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-2xl text-gray-400 absolute">📷</span>
                </div>

                <div>
                  <p className="font-medium text-lg">{pet.petName}</p>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                  <p
                    className={`text-sm mt-1 ${
                      isComplete ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {isComplete ? "✓ Complete" : "⚠ Incomplete"}
                  </p>
                </div>
              </div>

              {/* MENU */}
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
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={() => router.push(`/edit-pet/${pet.id}`)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit profile
                    </button>

                    {/* NEW QR OPTION */}
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        handleGenerateQR(pet);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Generate QR Code
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

      {/* QR MODAL (NEW) */}
      {qrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              QR Code for {qrPetName}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Attach this QR code to your pet’s collar
            </p>

            {qrLoading ? (
              <p>Generating QR...</p>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href={qrUrl}
                  target="_blank"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-center"
                >
                  Preview QR
                </a>

                <a
                  href={qrUrl}
                  download={`pet-${qrPetName}-qr.pdf`}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white text-center"
                >
                  Download QR
                </a>
              </div>
            )}

            <button
              onClick={() => setQrUrl(null)}
              className="mt-5 text-sm text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && petToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
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
