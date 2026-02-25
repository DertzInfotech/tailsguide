"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyPets, deletePetMedia } from "@/api/petApi";
import { submitReport } from "@/lib/api-client";
import { useObjectDetection, MIN_CONFIDENCE_FOR_AUTOFILL } from "@/utils/useObjectDetection";

const MAX_PHOTOS = 5;

/** Thumbnail URL via app */
const getThumbnailUrl = (petId) => `/api/v1/pet/${petId}/thumbnail`;
/** Image URL for media */
const getMediaImageUrl = (urlOrPath) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith("http")) return urlOrPath;
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `/api/v1${path}`;
};

export default function EditPetProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [pet, setPet] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  /* ---------- AI DETECTION ---------- */
  const { detectAndClassify, modelLoaded, isLoading: isAiLoading, error: aiError } = useObjectDetection();
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(null); // number | null (within newPhotos)
  const [primaryPhotoFile, setPrimaryPhotoFile] = useState(null); // File | null
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  /* ---------- PET DETAILS ---------- */
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
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
  const [isSMSChecked, setIsSMSChecked] = useState(true);
  const [isEmailChecked, setIsEmailChecked] = useState(true);
  const [isSocialChecked, setIsSocialChecked] = useState(true);
  const [isWPChecked, setIsWPChecked] = useState(true);

  /* ---------- MEDICAL ---------- */
  const [microchipId, setMicrochipId] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  /* ---------- MEDIA ---------- */
  const [existingMedia, setExistingMedia] = useState([]); // { id, url, mediaType }[] from API
  const [newPhotos, setNewPhotos] = useState([]); // File[]
  /* Custom modal: ask "Set as primary?" only the first time (when no primary yet) */
  const [showPrimaryModal, setShowPrimaryModal] = useState(false);
  const [pendingPrimaryFile, setPendingPrimaryFile] = useState(null);
  const [deletingMediaId, setDeletingMediaId] = useState(null);

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
        setPetType(found.petType || "");
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
        setVeterinarian(found.veterinarian || "");
        setMedicalConditions(found.medicalConditions || "");
        setSpecialInstructions(found.specialInstructions || "");

        setExistingMedia(Array.isArray(found.media) ? found.media : []);
      } catch (err) {
        console.error(err);
        setToast({ type: "error", text: "Failed to load pet details" });
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, router]);

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  /* ---------- PHOTO HANDLERS ---------- */
  const totalPhotoCount = existingMedia.length + newPhotos.length;

  const addPhoto = (file) => {
    if (!file) return;
    if (totalPhotoCount >= MAX_PHOTOS) return;

    const newIndex = newPhotos.length;
    setNewPhotos((prev) => [...prev, file]);

    // Ask "Set as primary?" only the very first time (no existing media, first new photo)
    if (existingMedia.length === 0 && newPhotos.length === 0) {
      setPendingPrimaryFile(file);
      setShowPrimaryModal(true);
    }
  };

  const confirmPrimaryChoice = (setAsPrimary) => {
    if (pendingPrimaryFile) {
      if (setAsPrimary) {
        setPrimaryPhotoIndex(newPhotos.length - 1);
        setPrimaryPhotoFile(pendingPrimaryFile);
        setAiResult(null);
      }
      setPendingPrimaryFile(null);
    }
    setShowPrimaryModal(false);
  };

  const removeExistingMedia = async (mediaId) => {
    try {
      setDeletingMediaId(mediaId);
      await deletePetMedia(mediaId);
      setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to delete photo" });
    } finally {
      setDeletingMediaId(null);
    }
  };

  const removePhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));

    setPrimaryPhotoIndex((prevIdx) => {
      if (prevIdx === null) return null;
      if (prevIdx === index) {
        setPrimaryPhotoFile(null);
        setAiResult(null);
        return null;
      }
      if (index < prevIdx) return prevIdx - 1;
      return prevIdx;
    });
  };

  const setAsPrimary = (index, file) => {
    setPrimaryPhotoIndex(index);
    setPrimaryPhotoFile(file);
    setAiResult(null);
  };

  const runPrimaryAIDetection = async () => {
    if (!primaryPhotoFile) {
      setToast({ type: "error", text: "Please select a primary photo first" });
      return;
    }

    if (!modelLoaded) {
      setToast({ type: "error", text: "AI model is still loading. Please try again in a moment." });
      return;
    }

    setIsAnalyzing(true);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.onload = async () => {
          const result = await detectAndClassify(img);
          setAiResult(result);
          if (result.confidence >= MIN_CONFIDENCE_FOR_AUTOFILL && result.type) {
            setPetType(result.type);
            if (result.breed) setBreed(result.breed);
            if (result.color) setPrimaryColor(result.color);
          }
          setIsAnalyzing(false);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(primaryPhotoFile);
    } catch (err) {
      console.error("AI detection error:", err);
      setToast({ type: "error", text: "AI analysis failed" });
      setIsAnalyzing(false);
    }
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    try {
      const petDTO = {
        id: pet.id,
        petName,
        petType,
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
        veterinarian,
        medicalConditions,
        specialInstructions,
        // Tell backend which existing media to keep (avoids "orphan deletion" error when updating)
        existingMediaIds: existingMedia.map((m) => m.id),
      };

      const formData = new FormData();
      formData.append("petDTO", new Blob([JSON.stringify(petDTO)], { type: "application/json" }));

      // Build photos array: primary first, then the rest (same as report page uses "photos")
      const photosToSend = [];
      if (primaryPhotoFile) photosToSend.push(primaryPhotoFile);
      newPhotos.forEach((file, idx) => {
        if (idx !== primaryPhotoIndex && file instanceof File) photosToSend.push(file);
      });
      photosToSend.forEach((file) => {
        formData.append("photos", file, file.name || "photo.jpg");
      });

      console.log("formData", formData )
      const result = await submitReport({
        method: "POST",
        body: formData,
      });

      if (result.response.ok) {
        setToast({ type: "success", text: "Profile updated successfully" });
        setTimeout(() => router.push("/my-pet"), 1200);
      } else {
        const r = result.result || {};
        const msg =
          r.businessErrorDescription || r.validationErrors || r.message || "Failed to save profile";
        setToast({
          type: "error",
          text: typeof msg === "string" ? msg : JSON.stringify(msg),
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to save profile" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/60 animate-pulse mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */
  const steps = ["Pet Details", "Location & Date", "Contact Info", "Medical Info"];
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Unique background: soft gradient + dot pattern */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 40%, #fef7ed 100%)",
          backgroundImage: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 40%, #fef7ed 100%), radial-gradient(circle at 1px 1px, rgba(180, 83, 9, 0.08) 1px, transparent 0)",
          backgroundSize: "100% 100%, 24px 24px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-stone-300/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 px-4 py-8 sm:py-12">
        {toast && (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white shadow-lg ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
            {toast.text}
          </div>
        )}

        {/* Custom modal: "Set as primary?" (only first time) */}
        {showPrimaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => confirmPrimaryChoice(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-amber-100" onClick={(e) => e.stopPropagation()}>
              <p className="text-gray-800 font-medium mb-4">Do you want to keep this as the primary photo?</p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => confirmPrimaryChoice(false)} className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50">No</button>
                <button type="button" onClick={() => confirmPrimaryChoice(true)} className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">Yes</button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700 font-medium mb-6 transition-colors"
          >
            <span aria-hidden>←</span> Back
          </button>

          {/* Main card: paper-style with left accent */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-100/80 overflow-hidden border-l-4 border-l-amber-400">
            <div className="p-6 sm:p-8 md:p-10">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-300/30 shrink-0">
                  ✏️
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">Edit Pet Profile</h1>
                  <p className="text-stone-500 mt-1">Update your pet&apos;s details step by step</p>
                </div>
              </div>

              {/* Step indicator - pill bar */}
              <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-amber-50/70 border border-amber-100/80 mb-8">
                {steps.map((label, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      index === currentStep
                        ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                        : index < currentStep
                          ? "text-amber-600 hover:bg-white/60"
                          : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${index === currentStep ? "bg-amber-500 text-white" : index < currentStep ? "bg-amber-200 text-amber-800" : "bg-stone-200"}`}>
                      {index < currentStep ? "✓" : index + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

        {/* Step 0: Pet Details */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Pet Details</h2>
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Pet Photo</p>
              <div className="flex items-start gap-6 flex-wrap">
                <img
                  src={pet ? `${pet.thumbnailUrl ? `/api/v1${pet.thumbnailUrl.startsWith("/") ? pet.thumbnailUrl : `/${pet.thumbnailUrl}`}` : getThumbnailUrl(pet.id)}?ts=${pet.updatedAt || Date.now()}` : ""}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                />
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-gray-500 mb-2">Photo Gallery (max {MAX_PHOTOS})</p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingMedia.map((m) => (
                      <div key={m.id} className="relative">
                        <img src={getMediaImageUrl(m.url) || getThumbnailUrl(pet?.id)} alt="" className="w-full h-24 object-cover rounded-lg bg-gray-100" />
                        <button
                          type="button"
                          onClick={() => removeExistingMedia(m.id)}
                          disabled={deletingMediaId === m.id}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs px-1.5 rounded disabled:opacity-50"
                        >
                          {deletingMediaId === m.id ? "…" : "✕"}
                        </button>
                      </div>
                    ))}
                    {newPhotos.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded-lg" alt="" />
                        {primaryPhotoIndex === idx ? (
                          <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAsPrimary(idx, file)}
                            className="absolute bottom-1 left-1 bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 rounded-full border hover:bg-white"
                          >
                            Set primary
                          </button>
                        )}
                        <button type="button" onClick={() => removePhoto(idx)} className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs px-1.5 rounded">✕</button>
                      </div>
                    ))}
                    {totalPhotoCount < MAX_PHOTOS && (
                      <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer text-gray-400 text-sm">
                        + Add
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f); e.target.value = ""; }} />
                      </label>
                    )}
                  </div>

                  <div className="mt-4">
                    {!primaryPhotoFile && newPhotos.length > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        Pick one photo and click <strong>Set primary</strong> to enable AI detection.
                      </div>
                    )}

                    {isAiLoading && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        Loading AI model…
                      </div>
                    )}

                    {aiError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {aiError}
                      </div>
                    )}

                    {primaryPhotoFile && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-start gap-4">
                          <img
                            src={URL.createObjectURL(primaryPhotoFile)}
                            alt=""
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-800">Primary photo</p>
                                <p className="text-xs text-gray-500">AI detection runs on this image</p>
                              </div>
                              <button
                                type="button"
                                onClick={runPrimaryAIDetection}
                                disabled={isAnalyzing || isAiLoading || !modelLoaded}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                                  isAnalyzing || isAiLoading || !modelLoaded
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                              >
                                {isAnalyzing ? "Analyzing…" : "Analyze with AI"}
                              </button>
                            </div>

                            {aiResult && !isAnalyzing && (
                              <div
                                className={`mt-3 p-3 rounded-lg border-2 ${
                                  aiResult.detected ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                                }`}
                              >
                                {aiResult.detected ? (
                                  <div>
                                    <p className="font-bold text-green-800">✅ Pet Detected</p>
                                    <div className="text-sm text-green-700 mt-1 space-y-0.5">
                                      {aiResult.type && (
                                        <p><strong>Type:</strong> {aiResult.type}</p>
                                      )}
                                      {aiResult.breed && (
                                        <p><strong>Breed:</strong> {aiResult.breed}</p>
                                      )}
                                      {aiResult.color && (
                                        <p><strong>Color:</strong> {aiResult.color}</p>
                                      )}
                                      <p><strong>Confidence:</strong> {aiResult.confidence}%</p>
                                    </div>
                                    {aiResult.confidence < MIN_CONFIDENCE_FOR_AUTOFILL && (
                                      <p className="mt-3 text-sm text-amber-700 font-medium">
                                        We couldn&apos;t confidently detect breed. Please select manually.
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <p className="font-bold text-yellow-800">⚠️ No Pet Detected</p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                      Try a clearer, well-lit photo where the pet is fully visible.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Enter pet's name" value={petName} set={setPetName} />
              <Select label="Report Type" value={reportType} set={setReportType} options={["LOST", "FOUND"]} placeholder="Select type" />
              <Select label="Pet Type" value={petType} set={setPetType} options={["Dog", "Cat", "Bird", "Other"]} placeholder="Select type" />
              <Input label="Enter pet's breed" value={breed} set={setBreed} />
              <Select
                label="Pet Age"
                value={age}
                set={setAge}
                options={["Puppy (0-1 year)", "Young (1-3 years)", "Adult (3-7 years)", "Senior (7+ years)"]}
                placeholder="Select age"
              />
              <Select label="Pet Gender" value={gender} set={setGender} options={["Male", "Female"]} placeholder="Select gender" />
              <Select label="Pet Size" value={size} set={setSize} options={["Small", "Medium", "Large"]} placeholder="Select size" />
              <Input label="Primary Color" value={primaryColor} set={setPrimaryColor} />
              <div className="md:col-span-2">
                <Textarea label="Distinctive Features" value={distinctiveFeatures} set={setDistinctiveFeatures} placeholder="Collar, markings, scars, behavior, etc." />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Location & Date */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Location & Date</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={reportType === "FOUND" ? "Where was the pet found?" : "Last seen location"}
                value={lastSeenLocation}
                set={setLastSeenLocation}
              />
              <Input
                type="date"
                label={reportType === "FOUND" ? "Date found" : "Last seen date"}
                value={lastSeenDate}
                set={setLastSeenDate}
              />
              <Input
                type="time"
                label={reportType === "FOUND" ? "Time found (optional)" : "Last seen time"}
                value={lastSeenTime}
                set={setLastSeenTime}
              />
              {reportType === "LOST" && (
                <div className="md:col-span-2">
                  <Textarea label="Circumstances" value={circumstances} set={setCircumstances} placeholder="How did your pet go missing? What were they doing?" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Your Name" value={ownerName} set={setOwnerName} />
              <Input label="Contact Number" value={ownerPhone} set={setOwnerPhone} />
              <Input label="Contact Email" value={ownerEmail} set={setOwnerEmail} />
              <Input label="Emergency Number" value={emergencyContact} set={setEmergencyContact} />
              <div className="md:col-span-2 mt-4">
                <h4 className="text-lg font-semibold mb-4 text-stone-700">Alert Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition">
                    <input type="checkbox" checked={isSMSChecked} onChange={(e) => setIsSMSChecked(e.target.checked)} className="h-4 w-4 rounded text-amber-500" />
                    SMS Alert
                  </label>
                  <label className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition">
                    <input type="checkbox" checked={isEmailChecked} onChange={(e) => setIsEmailChecked(e.target.checked)} className="h-4 w-4 rounded text-amber-500" />
                    Email Notification
                  </label>
                  <label className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition">
                    <input type="checkbox" checked={isSocialChecked} onChange={(e) => setIsSocialChecked(e.target.checked)} className="h-4 w-4 rounded text-amber-500" />
                    Social Media Sharing
                  </label>
                  <label className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition">
                    <input type="checkbox" checked={isWPChecked} onChange={(e) => setIsWPChecked(e.target.checked)} className="h-4 w-4 rounded text-amber-500" />
                    Community WhatsApp Groups
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Medical Info */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Medical Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Microchip ID" value={microchipId} set={setMicrochipId} />
              <Input label="Veterinarian" value={veterinarian} set={setVeterinarian} />
              <div className="md:col-span-2">
                <Textarea label="Medical Conditions & Medications" value={medicalConditions} set={setMedicalConditions} placeholder="Any ongoing medical conditions, required medications, allergies, etc." />
              </div>
              <div className="md:col-span-2">
                <Textarea label="Special Instructions" value={specialInstructions} set={setSpecialInstructions} placeholder="Behavioral notes, approach instructions, etc." />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-amber-100/80">
          {currentStep > 0 ? (
            <button type="button" onClick={handlePrevStep} className="px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200 transition-colors">
              Previous
            </button>
          ) : (
            <button type="button" onClick={() => router.back()} className="px-6 py-3 text-stone-500 hover:text-stone-700 font-medium transition-colors">
              Cancel
            </button>
          )}
          {currentStep < 3 ? (
            <button type="button" onClick={handleNextStep} className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-md shadow-amber-300/30 transition-all">
              Next
            </button>
          ) : (
            <button type="button" onClick={handleSave} className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-md shadow-emerald-300/30 transition-all">
              Save Profile
            </button>
          )}
        </div>
            </div>
          </div>
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
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition"
      />
      <label className="absolute left-4 top-2 text-xs text-stone-500">{label}</label>
    </div>
  );
}

function Select({ label, value, set, options, placeholder = "Not Applicable" }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <label className="absolute left-4 top-2 text-xs text-stone-500">{label}</label>
    </div>
  );
}

function Textarea({ label, value, set, placeholder }) {
  return (
    <div className="relative sm:col-span-2">
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 pt-6 pb-2 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition min-h-[110px]"
      />
      <label className="absolute left-4 top-2 text-xs text-stone-500">{label}</label>
    </div>
  );
}
