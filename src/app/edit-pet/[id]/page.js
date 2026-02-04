"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyPets, reportPet } from "@/api/petApi";

export default function EditPetProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [distinctiveFeatures, setDistinctiveFeatures] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ---------------- FETCH PET ---------------- */

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await getMyPets();
        const found = res.data.find(
          (p) => String(p.id) === String(id)
        );

        if (!found) {
          router.push("/my-pet");
          return;
        }

        setPet(found);
        setGender(found.gender || "");
        setSize(found.size || "");
        setPrimaryColor(found.primaryColor || "");
        setDistinctiveFeatures(found.distinctiveFeatures || "");
        setLastSeenLocation(found.lastSeenLocation || "");
        setOwnerName(found.ownerName || "");
        setOwnerPhone(found.ownerPhone || "");
        setPhotoPreview(found.photoUrl || null);
      } catch (err) {
        console.error(err);
        setToast({ type: "error", text: "Failed to load pet details" });
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, router]);

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!pet?.id) return;

    try {
      const payload = {
        id: pet.id, 
        petName: pet.petName,
        breed: pet.breed,
        age: pet.age ?? null,
        gender,
        size,
        primaryColor,
        distinctiveFeatures,
        reportType: pet.reportType || "LOST",
        lastSeenLocation,
        lastSeenDate: pet.lastSeenDate ?? null,
        lastSeenTime: pet.lastSeenTime ?? null,
        circumstances: pet.circumstances ?? null,
        ownerName,
        ownerPhone,
        ownerEmail: pet.ownerEmail ?? null,
        emergencyContact: pet.emergencyContact ?? null,
        microchipId: pet.microchipId ?? null,
        medicalConditions: pet.medicalConditions ?? null,
        specialInstructions: pet.specialInstructions ?? null,
      };

      // 🔥 DATA + PHOTO TOGETHER 
      await reportPet(payload, photoFile);

      setToast({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => router.push("/my-pet"), 1200);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to save profile" });
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded-xl text-sm text-white shadow-lg
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Edit Pet Profile
        </h1>

        {/* PHOTO */}
        <div>
          <p className="text-sm font-medium mb-2">Pet Photo</p>
          <label className="block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:border-green-400 transition">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Pet"
                className="mx-auto w-40 h-40 object-cover rounded-xl"
              />
            ) : (
              <span className="text-gray-400">
                Click to upload or replace photo
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setPhotoFile(file);
                setPhotoPreview(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Gender" value={gender} set={setGender} />
          <Input label="Size" value={size} set={setSize} />
          <Input
            label="Primary Color"
            value={primaryColor}
            set={setPrimaryColor}
          />
          <Input
            label="Last Seen Location"
            value={lastSeenLocation}
            set={setLastSeenLocation}
          />
        </div>

        <Textarea
          label="Distinctive Features"
          value={distinctiveFeatures}
          set={setDistinctiveFeatures}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Owner Name" value={ownerName} set={setOwnerName} />
          <Input label="Owner Phone" value={ownerPhone} set={setOwnerPhone} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600
            text-white px-6 py-2.5 rounded-xl shadow"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Input({ label, value, set }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-300
        focus:ring-2 focus:ring-green-300 outline-none"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">
        {label}
      </label>
    </div>
  );
}

function Textarea({ label, value, set }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-300
        min-h-[110px] focus:ring-2 focus:ring-green-300 outline-none"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">
        {label}
      </label>
    </div>
  );
}
