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

  /* ---------- PHOTO (SAFE MODEL) ---------- */
  const [serverPhotoUrl, setServerPhotoUrl] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  /* ---------- FETCH PET ---------- */
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

        setServerPhotoUrl(
          found.photoUrl &&
            found.photoUrl !== "null" &&
            found.photoUrl !== "undefined" &&
            found.photoUrl.trim() !== ""
            ? found.photoUrl
            : null
        );
        setPreviewPhotoUrl(null);
        setPhotoFile(null);
      } catch (err) {
        console.error(err);
        setToast({ type: "error", text: "Failed to load pet details" });
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, router]);

  /* ---------- PHOTO HANDLERS ---------- */
  const onSelectPhoto = (file) => {
    if (!file) return;
    setPreviewPhotoUrl(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const deletePhoto = () => {
    setPreviewPhotoUrl(null);
    setPhotoFile(null);
    setServerPhotoUrl(null);
  };

  const API_BASE = "http://64.225.84.126:8084";

  const resolvePhotoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/api")) return `${API_BASE}${url}`;
    return `${API_BASE}/api/v1${url}`;
  };

  const isValidPhotoUrl = (url) => {
    if (typeof url !== "string") return false;
    return url.includes("/uploads/") && url.match(/\.(jpg|jpeg|png|webp)$/i);
  };

  const hasPhoto =
    previewPhotoUrl !== null ||
    (typeof serverPhotoUrl === "string" &&
      serverPhotoUrl.trim().length > 0 &&
      isValidPhotoUrl(serverPhotoUrl));


  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    if (!pet?.id) return;

    try {
      const normalizedReportType =
        reportType === "NA" ? null : reportType;

      const payload = {
        id: pet.id,
        petName,
        breed,
        age,
        gender,
        size,
        primaryColor,
        distinctiveFeatures,

        reportType: normalizedReportType,

        // Only include report details if LOST or FOUND
        ...(normalizedReportType && {
          lastSeenLocation,
          lastSeenDate,
          lastSeenTime,
          circumstances,
        }),

        ownerName,
        ownerPhone,
        ownerEmail,
        emergencyContact,
        microchipId,
        medicalConditions,
        specialInstructions,
      };

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

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      {toast && (
        <div
          className={`
      fixed top-20 left-1/2 -translate-x-1/2 z-50
      px-6 py-3 rounded-xl text-sm text-white
      shadow-md
      ${toast.type === "success"
              ? "bg-green-500/90"
              : "bg-red-500/90"}
    `}
        >
          {toast.text}
        </div>
      )}


      <div className="
  max-w-2xl mx-auto
  bg-white
  rounded-2xl
  shadow-[0_8px_30px_rgba(0,0,0,0.06)]
  border border-gray-200
  p-10 space-y-10
">
        <h1 className="text-2xl font-semibold">Edit Pet Profile</h1>

        {/* PHOTO */}
        <div>
          <p className="text-sm font-medium mb-2">Pet Photo</p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            {hasPhoto ? (
              <>
                <img
                  src={
                    previewPhotoUrl
                      ? previewPhotoUrl
                      : resolvePhotoUrl(serverPhotoUrl)
                  }
                  className="mx-auto w-40 h-40 object-cover rounded-xl"
                  alt="Pet photo"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="flex justify-center gap-4 mt-3">
                  <label className="text-green-600 cursor-pointer text-sm">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        onSelectPhoto(e.target.files[0])
                      }
                    />


                  </label>

                  <button
                    onClick={deletePhoto}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer text-gray-400">
                <div className="text-sm">
                  No photo uploaded yet
                </div>
                <div className="text-xs mt-1">
                  Click to upload a pet photo
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    onSelectPhoto(e.target.files[0])
                  }
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
        </Section>

        {/* REPORT DETAILS */}
        <Section title="Report Details">
          <Select label="Report Type" value={reportType} set={setReportType} options={["LOST", "FOUND"]} />
          {reportType === "LOST" && (
            <>
              <Input label="Last Seen Location" value={lastSeenLocation} set={setLastSeenLocation} />
              <Input label="Last Seen Date" type="date" value={lastSeenDate} set={setLastSeenDate} />
              <Input label="Last Seen Time" type="time" value={lastSeenTime} set={setLastSeenTime} />
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
          className="
    text-sm
    font-medium
    text-gray-900
    inline-flex items-center gap-1
    hover:underline
    focus:outline-none
  "
        >
          {showMedical ? "Hide" : "Show"} Medical & Identification
          <span className="text-gray-500">
            {showMedical ? "▴" : "▾"}
          </span>
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
          <button onClick={() => router.back()} className="text-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="
  bg-[#fe9e3c] hover:bg-[#f38f22]
  text-white
  px-6 py-2.5
  rounded-lg
  transition
"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-sm font-semibold text-gray-900 tracking-wide">
        {title.toUpperCase()}
      </h2>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {children}
      </div>
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
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-0 outline-none"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">
        {label}
      </label>
    </div>
  );
}

function Select({ label, value, set, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-0 outline-none bg-white"
      >
        <option value="NA">Not Applicable</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <label className="absolute left-4 top-2 text-xs text-gray-400">
        {label}
      </label>
    </div>
  );
}

function Textarea({ label, value, set }) {
  return (
    <div className="relative sm:col-span-2">
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-300 min-h-[110px] focus:ring-2 focus:ring-green-300 outline-none"
      />
      <label className="absolute left-4 top-2 text-xs text-gray-400">
        {label}
      </label>
    </div>
  );
}
