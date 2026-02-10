"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyPets, reportPet } from "@/api/petApi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const MAX_PHOTOS = 5;

export default function EditPetProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [pet, setPet] = useState(null);

  /* ---------- PET DETAILS ---------- */
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [distinctiveFeatures, setDistinctiveFeatures] = useState("");

  /* ---------- REPORT DETAILS ---------- */
  const [reportType, setReportType] = useState("LOST");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [lastSeenDate, setLastSeenDate] = useState("");
  const [lastSeenTime, setLastSeenTime] = useState("");
  const [circumstances, setCircumstances] = useState("");

  /* ---------- OWNER ---------- */
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  /* ---------- MEDICAL ---------- */
  const [microchipId, setMicrochipId] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showMedical, setShowMedical] = useState(false);

  /* ---------- MEDIA ---------- */
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [newPhotos, setNewPhotos] = useState([]); // File[]

  /* ---------- LOAD PET ---------- */
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await getMyPets();
        const found = res.data.find(p => String(p.id) === String(id));

        if (!found) {
          router.push("/my-pet");
          return;
        }

        setPet(found);

        setPetName(found.petName || "");
        setBreed(found.breed || "");
        setAge(found.age || "");
        setGender(found.gender || "");
        setSize(found.size || "");
        setPrimaryColor(found.primaryColor || "");
        setDistinctiveFeatures(found.distinctiveFeatures || "");

        setReportType(found.reportType || "LOST");
        setLastSeenLocation(found.lastSeenLocation || "");
        setLastSeenDate(found.lastSeenDate || "");
        setLastSeenTime(found.lastSeenTime || "");
        setCircumstances(found.circumstances || "");

        setOwnerName(found.ownerName || "");
        setOwnerPhone(found.ownerPhone || "");
        setOwnerEmail(found.ownerEmail || "");
        setEmergencyContact(found.emergencyContact || "");

        setMicrochipId(found.microchipId || "");
        setMedicalConditions(found.medicalConditions || "");
        setSpecialInstructions(found.specialInstructions || "");

        setThumbnailUrl(`${API_BASE}/api/v1/pet/${id}/thumbnail`);
      } catch (err) {
        console.error(err);
        setToast({ type: "error", text: "Failed to load pet details" });
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, router]);

  /* ---------- PHOTO HANDLERS (FRONTEND ONLY) ---------- */
  const addPhoto = (file) => {
    if (!file) return;
    if (newPhotos.length >= MAX_PHOTOS) return;
    setNewPhotos(prev => [...prev, file]);
  };

  const removePhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    try {
      await reportPet(
        {
          id: pet.id,
          petName,
          breed,
          age,
          gender,
          size,
          primaryColor,
          distinctiveFeatures,
          reportType,
          lastSeenLocation,
          lastSeenDate,
          lastSeenTime,
          circumstances,
          ownerName,
          ownerPhone,
          ownerEmail,
          emergencyContact,
          microchipId,
          medicalConditions,
          specialInstructions,
        },
        newPhotos // File[]
      );

      setToast({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => router.push("/my-pet"), 1200);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to save profile" });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-10 space-y-10">
        <h1 className="text-2xl font-semibold">Edit Pet Profile</h1>

        {/* THUMBNAIL */}
        <div>
          <p className="text-sm font-medium mb-2">Pet Thumbnail</p>
          <img src={thumbnailUrl} className="w-24 h-24 rounded-full object-cover border" />
        </div>

        {/* PHOTO GALLERY */}
        <div>
          <p className="text-sm font-medium mb-2">Photo Gallery (max 5)</p>
          <div className="grid grid-cols-3 gap-4">
            {newPhotos.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            {newPhotos.length < MAX_PHOTOS && (
              <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer text-gray-400">
                + Add
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addPhoto(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* PET DETAILS */}
        <Section title="Pet Details">
          <Input label="Pet Name" value={petName} set={setPetName} />
          <Input label="Breed" value={breed} set={setBreed} />
          <Select label="Age" value={age} set={setAge} options={["Puppy", "Adult", "Senior"]} />
          <Select label="Gender" value={gender} set={setGender} options={["Male", "Female", "Unknown"]} />
          <Select label="Size" value={size} set={setSize} options={["Small", "Medium", "Large"]} />
          <Input label="Primary Color" value={primaryColor} set={setPrimaryColor} />
          <Textarea label="Distinctive Features" value={distinctiveFeatures} set={setDistinctiveFeatures} />
        </Section>

        {/* REPORT DETAILS */}
        <Section title="Report Details">
          <Select label="Report Type" value={reportType} set={setReportType} options={["LOST", "FOUND"]} />
          {reportType === "LOST" && (
            <>
              <Input label="Last Seen Location" value={lastSeenLocation} set={setLastSeenLocation} />
              <Input type="date" label="Last Seen Date" value={lastSeenDate} set={setLastSeenDate} />
              <Input type="time" label="Last Seen Time" value={lastSeenTime} set={setLastSeenTime} />
              <Textarea label="Circumstances" value={circumstances} set={setCircumstances} />
            </>
          )}
        </Section>

        {/* OWNER */}
        <Section title="Owner & Contact">
          <Input label="Owner Name" value={ownerName} set={setOwnerName} />
          <Input label="Owner Phone" value={ownerPhone} set={setOwnerPhone} />
          <Input label="Owner Email" value={ownerEmail} set={setOwnerEmail} />
          <Input label="Emergency Contact" value={emergencyContact} set={setEmergencyContact} />
        </Section>

        {/* MEDICAL */}
        <button
          onClick={() => setShowMedical(!showMedical)}
          className="text-sm font-medium hover:underline"
        >
          {showMedical ? "Hide" : "Show"} Medical & Identification
        </button>

        {showMedical && (
          <Section>
            <Input label="Microchip ID" value={microchipId} set={setMicrochipId} />
            <Textarea label="Medical Conditions" value={medicalConditions} set={setMedicalConditions} />
            <Textarea label="Special Instructions" value={specialInstructions} set={setSpecialInstructions} />
          </Section>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button onClick={() => router.back()} className="text-gray-500">Cancel</button>
          <button onClick={handleSave} className="bg-[#fe9e3c] text-white px-6 py-2.5 rounded-lg">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-sm font-semibold">{title.toUpperCase()}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Input({ label, value, set, type = "text" }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">{label}</label>
    </div>
  );
}

function Select({ label, value, set, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border bg-white"
      >
        <option value="NA">Not Applicable</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <label className="absolute left-4 top-2 text-xs text-gray-400">{label}</label>
    </div>
  );
}

function Textarea({ label, value, set }) {
  return (
    <div className="relative sm:col-span-2">
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border min-h-[110px]"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">{label}</label>
    </div>
  );
}
