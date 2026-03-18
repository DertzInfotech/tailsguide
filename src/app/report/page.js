'use client';

import { useState, useRef, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useObjectDetection, MIN_CONFIDENCE_FOR_AUTOFILL } from "../../utils/useObjectDetection";
import Input from "@/shared/Input";
import Notification from "@/shared/Notification";
import { submitReport } from "@/lib/api-client";

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // UI hard limit per photo (safety)
const DEFAULT_TARGET_PHOTO_BYTES = 200 * 1024; // default target; user can lower using UI tool
const DRAFT_KEY = "tails_report_draft_v1";

async function compressImageFile(file, { maxBytes = DEFAULT_TARGET_PHOTO_BYTES, maxDimension = 960 } = {}) {
  try {
    if (!(file instanceof File)) return file;
    if (!file.type?.startsWith("image/")) return file;

    // Already small enough
    if (file.size <= maxBytes) return file;

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read_failed"));
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("image_decode_failed"));
      i.src = dataUrl;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return file;

    const scale = Math.min(1, maxDimension / Math.max(w, h));
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, outW, outH);

    const tryEncode = async (type, quality) =>
      await new Promise((resolve) => {
        canvas.toBlob(
          (b) => resolve(b || null),
          type,
          quality
        );
      });

    const safeName = (file.name || "photo").replace(/\.[^.]+$/, "");

    // Prefer WebP when available, fall back to JPEG.
    // We keep trying lower quality; if still too large, we downscale further and retry.
    const candidates = [
      { type: "image/webp", ext: "webp" },
      { type: "image/jpeg", ext: "jpg" },
    ];
    const qualities = [0.82, 0.72, 0.62, 0.52, 0.42, 0.34, 0.28];
    const scales = [1, 0.9, 0.8, 0.72, 0.64, 0.56];

    for (const scale2 of scales) {
      if (scale2 !== 1) {
        const w2 = Math.max(1, Math.round(outW * scale2));
        const h2 = Math.max(1, Math.round(outH * scale2));
        canvas.width = w2;
        canvas.height = h2;
        const ctx2 = canvas.getContext("2d");
        if (!ctx2) break;
        ctx2.drawImage(img, 0, 0, w2, h2);
      }

      for (const c of candidates) {
        for (const q of qualities) {
          const blob = await tryEncode(c.type, q);
          if (!blob) continue;
          if (blob.size <= maxBytes) {
            return new File([blob], `${safeName}.${c.ext}`, { type: c.type });
          }
        }
      }
    }

    // Return smallest attempt we have (likely jpeg at lowest quality)
    const smallest = (await tryEncode("image/jpeg", 0.28)) || null;
    return smallest ? new File([smallest], `${safeName}.jpg`, { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

async function ensureOptimizedPhoto(file, maxBytes) {
  if (!(file instanceof File)) return file;
  // Always attempt to optimize to backend-friendly size
  const optimized = await compressImageFile(file, { maxBytes, maxDimension: 960 });
  return optimized;
}

export default function ReportPage() {
  const [reportType, setReportType] = useState('lost');
  const [currentStep, setCurrentStep] = useState(0);
  /* Multiple photos: arrays of File, primary index for each form */
  const [lostPetPhotos, setLostPetPhotos] = useState([]);
  const [lostPrimaryPhotoIndex, setLostPrimaryPhotoIndex] = useState(0);
  const [foundPetPhotos, setFoundPetPhotos] = useState([]);
  const [foundPrimaryPhotoIndex, setFoundPrimaryPhotoIndex] = useState(0);
  const [lostPetDetection, setLostPetDetection] = useState(null);
  const [foundPetDetection, setFoundPetDetection] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { detectAndClassify, modelLoaded, isLoading, error } = useObjectDetection();
  const [notification, setNotification] = useState(null);
  const [photoUploadError, setPhotoUploadError] = useState(null);
  const [photoUploadInfo, setPhotoUploadInfo] = useState(null);
  const [compressTargetKb, setCompressTargetKb] = useState(200);
  const [compressing, setCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState(lostPetDetection?.petType)
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [size, setSize] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [distinctiveFeature, setDistinctiveFeature] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [circumstances, setCircumstances] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emergencyNo, setEmergencyNo] = useState('');
  const [isSMSChecked, setIsSMSChecked] = useState(true);
  const [isEmailChecked, setIsEmailChecked] = useState(true);
  const [isSocialChecked, setIsSocialChecked] = useState(true);
  const [isWPChecked, setIsWPChecked] = useState(true);
  const [microchipID, setMicrochipId] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const router = useRouter();

  const [foundLocation, setFoundLocation] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [petCondition, setPetCondition] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [foundersName, setFoundersName] = useState('');
  const [foundersPhoneNO, setFoundersPhoneNo] = useState('');
  const [foundersEmail, setFoundersEmail] = useState('');
  const [careArrangement, setCareArrangement] = useState('');

  // Auto-populate date & time fields with current local date/time
  useEffect(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    if (!lastSeenDate) setLastSeenDate(today);
    if (!lastSeenTime) setLastSeenTime(time);
    if (!foundDate) setFoundDate(today);
  }, []);

  // Restore draft on first mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
      if (!raw) return;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object") return;

      // Only restore text fields (photos can't be restored)
      if (d.reportType) setReportType(d.reportType);
      if (Number.isFinite(d.currentStep)) setCurrentStep(d.currentStep);

      setPetName(d.petName ?? "");
      setPetType(d.petType ?? "");
      setBreed(d.breed ?? "");
      setAge(d.age ?? "");
      setGender(d.gender ?? "");
      setSize(d.size ?? "");
      setPrimaryColor(d.primaryColor ?? "");
      setDistinctiveFeature(d.distinctiveFeature ?? "");
      setLastLocation(d.lastLocation ?? "");
      setLastSeenDate(d.lastSeenDate ?? "");
      setLastSeenTime(d.lastSeenTime ?? "");
      setCircumstances(d.circumstances ?? "");
      setContactName(d.contactName ?? "");
      setContactNo(d.contactNo ?? "");
      setContactEmail(d.contactEmail ?? "");
      setEmergencyNo(d.emergencyNo ?? "");
      setIsSMSChecked(d.isSMSChecked ?? true);
      setIsEmailChecked(d.isEmailChecked ?? true);
      setIsSocialChecked(d.isSocialChecked ?? true);
      setIsWPChecked(d.isWPChecked ?? true);
      setMicrochipId(d.microchipID ?? "");
      setVeterinarian(d.veterinarian ?? "");
      setMedicalCondition(d.medicalCondition ?? "");
      setSpecialInstructions(d.specialInstructions ?? "");

      setFoundLocation(d.foundLocation ?? "");
      setFoundDate(d.foundDate ?? "");
      setPetCondition(d.petCondition ?? "");
      setPetDescription(d.petDescription ?? "");
      setFoundersName(d.foundersName ?? "");
      setFoundersPhoneNo(d.foundersPhoneNO ?? "");
      setFoundersEmail(d.foundersEmail ?? "");
      setCareArrangement(d.careArrangement ?? "");

      setDraftRestored(true);
      setTimeout(() => setDraftRestored(false), 6000);
    } catch {
      // ignore
    }
  }, []);

  // Autosave draft (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      try {
        const draft = {
          reportType,
          currentStep,
          petName,
          petType,
          breed,
          age,
          gender,
          size,
          primaryColor,
          distinctiveFeature,
          lastLocation,
          lastSeenDate,
          lastSeenTime,
          circumstances,
          contactName,
          contactNo,
          contactEmail,
          emergencyNo,
          isSMSChecked,
          isEmailChecked,
          isSocialChecked,
          isWPChecked,
          microchipID,
          veterinarian,
          medicalCondition,
          specialInstructions,
          foundLocation,
          foundDate,
          petCondition,
          petDescription,
          foundersName,
          foundersPhoneNO,
          foundersEmail,
          careArrangement,
          savedAt: Date.now(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }, 650);
    return () => clearTimeout(t);
  }, [
    reportType,
    currentStep,
    petName,
    petType,
    breed,
    age,
    gender,
    size,
    primaryColor,
    distinctiveFeature,
    lastLocation,
    lastSeenDate,
    lastSeenTime,
    circumstances,
    contactName,
    contactNo,
    contactEmail,
    emergencyNo,
    isSMSChecked,
    isEmailChecked,
    isSocialChecked,
    isWPChecked,
    microchipID,
    veterinarian,
    medicalCondition,
    specialInstructions,
    foundLocation,
    foundDate,
    petCondition,
    petDescription,
    foundersName,
    foundersPhoneNO,
    foundersEmail,
    careArrangement,
  ]);

  const handleTypeChange = (type) => {
    setReportType(type);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reportType === 'lost' && lostPetPhotos.length === 0) {
      showNotification('Please add at least one pet photo.', 'error');
      return;
    }
    if (reportType === 'found' && foundPetPhotos.length === 0) {
      showNotification('Please add at least one pet photo.', 'error');
      return;
    }
    setPhotoUploadError(null);
    setIsSubmitting(true);

    // Final safety: optimize all selected photos right before submit.
    // IMPORTANT: use the optimized arrays immediately (setState is async).
    const targetBytes = Math.max(50, Number(compressTargetKb) || 200) * 1024;
    let submitLostPhotos = lostPetPhotos;
    let submitFoundPhotos = foundPetPhotos;
    try {
      showNotification("Optimizing photos…", "info");
      if (reportType === "lost" && lostPetPhotos.length > 0) {
        submitLostPhotos = await Promise.all(lostPetPhotos.map((f) => ensureOptimizedPhoto(f, targetBytes)));
        setLostPetPhotos(submitLostPhotos);
      }
      if (reportType === "found" && foundPetPhotos.length > 0) {
        submitFoundPhotos = await Promise.all(foundPetPhotos.map((f) => ensureOptimizedPhoto(f, targetBytes)));
        setFoundPetPhotos(submitFoundPhotos);
      }
    } catch {
      // ignore optimization failures; server-side will validate
    }

    const tooLarge = (f) => f instanceof File && f.size > targetBytes;
    if (reportType === "lost" && submitLostPhotos.some(tooLarge)) {
      const msg = `One or more photos are still too large after compression. Try lowering the target (currently ${Math.round(targetBytes / 1024)}KB).`;
      setPhotoUploadError(msg);
      showNotification(msg, "error");
      setIsSubmitting(false);
      return;
    }
    if (reportType === "found" && submitFoundPhotos.some(tooLarge)) {
      const msg = `One or more photos are still too large after compression. Try lowering the target (currently ${Math.round(targetBytes / 1024)}KB).`;
      setPhotoUploadError(msg);
      showNotification(msg, "error");
      setIsSubmitting(false);
      return;
    }

    // Backend appears to have a strict request size limit. To ensure reports submit reliably,
    // we only upload the primary photo (users can add more later once server limit is raised).
    setPhotoUploadInfo("To fit server upload limits, only the primary photo will be uploaded for now.");

    const formdata = new FormData();
    const lostPetJSON = {
      petName: petName,
      breed: breed,
      age: age,
      gender: gender,
      size: size,
      primaryColor: primaryColor,
      distinctiveFeatures: distinctiveFeature,
      reportType: reportType.toUpperCase(),
      lastSeenLocation: lastLocation,
      lastSeenDate: lastSeenDate,
      lastSeenTime: lastSeenTime,
      circumstances: circumstances,
      ownerName: contactName,
      ownerPhone: contactNo,
      ownerEmail: contactEmail,
      emergencyContact: emergencyNo,
      microchipId: microchipID,
      medicalConditions: medicalCondition,
      specialInstructions: specialInstructions,
    };

    const foundPetJSON = { 
      petName: null,
      breed:  null,
      age: null,
      gender: null,
      size: null,
      primaryColor: null,
      distinctiveFeatures: distinctiveFeature,
      reportType: reportType.toUpperCase(),
      lastSeenLocation: foundLocation,
      lastSeenDate: foundDate,
      lastSeenTime: null,
      circumstances: circumstances,
      ownerName: foundersName,
      ownerPhone: foundersPhoneNO,
      ownerEmail: foundersEmail,
      emergencyContact: null,
      microchipId: null,
      medicalConditions: null,
      specialInstructions: specialInstructions,
    };

    if (reportType === 'lost') {
      formdata.append('petDTO', new Blob([JSON.stringify(lostPetJSON)], { type: 'application/json' }));
      const lostPrimary = submitLostPhotos[lostPrimaryPhotoIndex];
      if (lostPrimary) formdata.append('photos', lostPrimary, lostPrimary.name || 'photo.jpg');
    }

    if (reportType === 'found') {
      formdata.append('petDTO', new Blob([JSON.stringify(foundPetJSON)], { type: 'application/json' }));
      const foundPrimary = submitFoundPhotos[foundPrimaryPhotoIndex];
      if (foundPrimary) formdata.append('photos', foundPrimary, foundPrimary.name || 'photo.jpg');
    }

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    try {

      const result = await submitReport(requestOptions);

      if (result.response.ok) {
        console.log("report submitted")
        showNotification(`${reportType === 'lost' ? 'Lost' : 'Found'} pet report submitted successfully!`, 'success');
        try { localStorage.removeItem(DRAFT_KEY); } catch {}
        setTimeout(() => {
          router.push('/');
        }, 2000)
      } else {
        const ve = result?.result?.validationErrors ?? result?.result?.error ?? result?.result?.message;
        const msg =
          typeof ve === "string"
            ? ve
            : Array.isArray(ve)
            ? ve.join(", ")
            : ve
            ? JSON.stringify(ve)
            : "Could not submit report. Please check your details and try again.";
        if (/max|maximum|size|mb|payload|too large|upload size exceeded/i.test(msg)) {
          setPhotoUploadError(msg);
        }
        showNotification(msg, 'error');
      }
      console.log(formdata);
    } catch (error) {
      console.log("Pet Data Submission Failed", error);
      showNotification("Pet Data Submission Failed", 'error')
    } finally {
      setIsSubmitting(false)
    }                  
  };

  const runAIDetection = async (type) => {
    const photos = type === 'lost' ? lostPetPhotos : foundPetPhotos;
    const primaryIndex = type === 'lost' ? lostPrimaryPhotoIndex : foundPrimaryPhotoIndex;
    const file = photos[primaryIndex];

    if (!file) {
      console.warn('No image selected');
      return;
    }

    if (!modelLoaded) {
      alert('AI model is still loading. Please wait a moment and try again.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.onload = async () => {
          const result = await detectAndClassify(img);

          if (type === 'lost') {
            setLostPetDetection(result);
            if (result.confidence >= MIN_CONFIDENCE_FOR_AUTOFILL && result.type) {
              setPetType(result.type);
              if (result.breed) setBreed(result.breed);
              if (result.color) setPrimaryColor(result.color);
            }
          } else {
            setFoundPetDetection(result);
          }

          setIsAnalyzing(false);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('AI detection error:', err);
      setIsAnalyzing(false);
    }
  };

  /* Lost: add / remove / set primary */
  const addLostPhoto = async (file) => {
    if (!file || lostPetPhotos.length >= MAX_PHOTOS) return;
    let finalFile = file;
    showNotification("Optimizing image…", "info");
    const targetBytes = Math.max(50, Number(compressTargetKb) || 200) * 1024;
    finalFile = await ensureOptimizedPhoto(file, targetBytes);
    if (finalFile.size > MAX_PHOTO_BYTES) {
      setPhotoUploadError(`Image is too large even after optimization. Please choose a smaller photo.`);
      showNotification("Image is too large. Please choose a smaller photo.", "error");
      return;
    }
    setPhotoUploadError(null);
    setPhotoUploadInfo(`Optimized to ${(finalFile.size / 1024).toFixed(0)}KB.`);
    setLostPetPhotos((prev) => [...prev, finalFile]);
    if (lostPetPhotos.length === 0) setLostPrimaryPhotoIndex(0);
    setLostPetDetection(null);
  };
  const removeLostPhoto = (index) => {
    setLostPetPhotos((prev) => prev.filter((_, i) => i !== index));
    setLostPrimaryPhotoIndex((prev) => {
      if (prev === index) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
    setLostPetDetection(null);
  };
  const setLostPrimary = (index) => {
    setLostPrimaryPhotoIndex(index);
    setLostPetDetection(null);
  };

  /* Found: add / remove / set primary */
  const addFoundPhoto = async (file) => {
    if (!file || foundPetPhotos.length >= MAX_PHOTOS) return;
    let finalFile = file;
    showNotification("Optimizing image…", "info");
    const targetBytes = Math.max(50, Number(compressTargetKb) || 200) * 1024;
    finalFile = await ensureOptimizedPhoto(file, targetBytes);
    if (finalFile.size > MAX_PHOTO_BYTES) {
      setPhotoUploadError(`Image is too large even after optimization. Please choose a smaller photo.`);
      showNotification("Image is too large. Please choose a smaller photo.", "error");
      return;
    }
    setPhotoUploadError(null);
    setPhotoUploadInfo(`Optimized to ${(finalFile.size / 1024).toFixed(0)}KB.`);
    setFoundPetPhotos((prev) => [...prev, finalFile]);
    if (foundPetPhotos.length === 0) setFoundPrimaryPhotoIndex(0);
    setFoundPetDetection(null);
  };

  const compressPhotosNow = async (type) => {
    const targetBytes = Math.max(50, Number(compressTargetKb) || 200) * 1024;
    const photos = type === "lost" ? lostPetPhotos : foundPetPhotos;
    if (!photos.length) {
      showNotification("Add a photo first.", "info");
      return;
    }
    setCompressing(true);
    setPhotoUploadError(null);
    try {
      showNotification(`Compressing to ~${Math.round(targetBytes / 1024)}KB…`, "info");
      const optimized = await Promise.all(photos.map((f) => ensureOptimizedPhoto(f, targetBytes)));
      if (type === "lost") setLostPetPhotos(optimized);
      else setFoundPetPhotos(optimized);
      const maxKb = Math.max(...optimized.map((f) => (f instanceof File ? f.size : 0))) / 1024;
      setPhotoUploadInfo(`Compressed. Largest photo: ${Math.round(maxKb)}KB (target ${Math.round(targetBytes / 1024)}KB).`);
    } catch (e) {
      console.error("Compression failed", e);
      setPhotoUploadError("Compression failed. Try a different photo.");
    } finally {
      setCompressing(false);
    }
  };
  const removeFoundPhoto = (index) => {
    setFoundPetPhotos((prev) => prev.filter((_, i) => i !== index));
    setFoundPrimaryPhotoIndex((prev) => {
      if (prev === index) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
    setFoundPetDetection(null);
  };
  const setFoundPrimary = (index) => {
    setFoundPrimaryPhotoIndex(index);
    setFoundPetDetection(null);
  };

  const showNotification = ( message, type = 'info') => {
      setNotification({ message, type });
    }
  
    useEffect(() => {
      if (notification) {
        const timer = setTimeout(() => {
          setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
      } 
    }, [notification]);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Report Lost or Found Pet
          </h1>
          <p className="text-gray-600">
            Help reunite pets with their families
          </p>
        </div>
        {draftRestored && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-lg text-center border border-amber-200">
            ✨ Draft restored. Your previous inputs were recovered (photos need to be re-added).
          </div>
        )}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
            🔄 Loading AI model...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            ❌ {error}
          </div>
        )}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => handleTypeChange('lost')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              reportType === 'lost'
  ? 'bg-[#fa7c15] text-white shadow-lg'
  : 'bg-white text-gray-600 hover:bg-gray-50'

              }`}
          >
            Lost Pet
          </button>
          <button
            onClick={() => handleTypeChange('found')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${reportType === 'found'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Found Pet
          </button>
        </div>

        {/* Lost Pet Form — mobile: single-column layout, more padding, step indicator scrollable */}
        {reportType === 'lost' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 sm:gap-0 sm:justify-between mb-6 sm:mb-8 overflow-x-auto pb-2 sm:pb-0 min-w-0">
              {['Pet Details', 'Location & Date', 'Contact Info', 'Medical Info'].map(
                (label, index) => (
                  <div
                    key={index}
                    className={`flex items-center shrink-0 ${index <= currentStep
                        ? 'text-orange-primary font-semibold'
                        : 'text-gray-400'
                      }`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mr-1.5 sm:mr-2 ${index <= currentStep
                          ? 'bg-orange-50 border-orange-primary text-orange-secondary'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className="hidden sm:inline text-sm lg:text-base">{label}</span>
                    {index < 3 && (
                      <div
                        className={`hidden sm:block h-0.5 w-6 lg:w-8 mx-1 lg:mx-2 ${index < currentStep ? 'bg-orange-primary' : 'bg-gray-300'
                          }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Pet Details</h2>
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Upload Pet Photo 📸</p>
                  <p className="text-sm text-gray-500 mb-2">Photo gallery (max {MAX_PHOTOS}). First primary photo is used for AI.</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600">Compression target</span>
                      <input
                        type="number"
                        min={50}
                        max={800}
                        value={compressTargetKb}
                        onChange={(e) => setCompressTargetKb(e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm"
                      />
                      <span className="text-xs text-gray-500">KB</span>
                    </div>
                    <button
                      type="button"
                      disabled={compressing || lostPetPhotos.length === 0}
                      onClick={() => compressPhotosNow("lost")}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
                    >
                      {compressing ? "Compressing…" : "Compress now"}
                    </button>
                  </div>
                  {photoUploadInfo && (
                    <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      {photoUploadInfo}
                    </div>
                  )}
                  {photoUploadError && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {photoUploadError}
                    </div>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {lostPetPhotos.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover rounded-lg bg-gray-100" />
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {(file.size / 1024).toFixed(0)}KB
                        </span>
                        {lostPrimaryPhotoIndex === idx ? (
                          <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full">Primary</span>
                        ) : (
                          <button type="button" onClick={() => setLostPrimary(idx)} className="absolute bottom-1 left-1 bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 rounded-full border hover:bg-white">Set primary</button>
                        )}
                        <button type="button" onClick={() => removeLostPhoto(idx)} className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs px-1.5 rounded">✕</button>
                      </div>
                    ))}
                    {lostPetPhotos.length < MAX_PHOTOS && (
                      <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer text-gray-400 text-sm">
                        + Add
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addLostPhoto(f); e.target.value = ''; }} />
                      </label>
                    )}
                  </div>
                  {lostPetPhotos.length > 0 && (
                    <button type="button" onClick={() => runAIDetection('lost')} disabled={isAnalyzing} className="mt-3 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                      {isAnalyzing ? 'Analyzing…' : 'Analyze primary photo with AI'}
                    </button>
                  )}
                  {isAnalyzing && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 font-medium">
                          🤖 AI is analyzing your image...
                        </span>
                      </div>
                    </div>
                  )}

                  {lostPetDetection && !isAnalyzing && (
                    <div
                      className={`mt-4 p-4 rounded-lg border-2 ${lostPetDetection.detected
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                        }`}
                    >
                      {lostPetDetection.detected ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">✅</span>
                            <span className="text-lg font-bold text-green-800">
                              Pet Detected!
                            </span>
                          </div>
                          <div className="space-y-1 text-green-700">
                            {lostPetDetection.type && (
                              <p><strong>Type:</strong> {lostPetDetection.type}</p>
                            )}
                            {lostPetDetection.breed && (
                              <p><strong>Breed:</strong> {lostPetDetection.breed}</p>
                            )}
                            {lostPetDetection.color && (
                              <p><strong>Color:</strong> {lostPetDetection.color}</p>
                            )}
                            <p><strong>Confidence:</strong> {lostPetDetection.confidence}%</p>
                          </div>
                          {lostPetDetection.confidence < MIN_CONFIDENCE_FOR_AUTOFILL && (
                            <p className="mt-3 text-sm text-amber-700 font-medium">
                              We couldn&apos;t confidently detect breed. Please select manually.
                            </p>
                          )}
                        </div>
                      ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">⚠️</span>
                            <span className="text-lg font-bold text-yellow-800">
                              No Pet Detected
                            </span>
                          </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Other form fields — mobile: single column to avoid overlay/truncation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 mt-8 sm:mt-10">
                  <div>
                    <Input
                      id="petname"
                      label="Enter pet's name"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Type {lostPetDetection?.detected && lostPetDetection?.type && `(AI: ${lostPetDetection.type})`}
                    </label>
                    <select 
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select type</option>
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      id="breed"
                      label="Enter pet's breed"
                      type="text"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Age
                    </label>
                    <select 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select age</option>
                      <option>Puppy (0-1 year)</option>
                      <option>Young (1-3 years)</option>
                      <option>Adult (3-7 years)</option>
                      <option>Senior (7+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Gender
                    </label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Size
                    </label>
                    <select 
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select size</option>
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      id="primarycolor"
                      label="Primary Color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Distinctive Features
                    </label>
                    <textarea 
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Collar, markings, scars, behavior, etc."
                      value={distinctiveFeature}
                      onChange={(e) => setDistinctiveFeature(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Location & Date</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="lastlocation"
                      label="Enter Last Seen Location"
                      type="text"
                      value={lastLocation}
                      onChange={(e) => setLastLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="lastseendate"
                      label="Enter Last Seen Date"
                      type="date"
                      value={lastSeenDate}
                      onChange={(e) => setLastSeenDate(e.target.value)}
                      className="hide-date-time"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="lastseentime"
                      label="Enter Last Seen Time"
                      type="time"
                      value={lastSeenTime}
                      onChange={(e) => setLastSeenTime(e.target.value)}
                      className="hide-date-time"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Circumstances
                    </label>
                    <textarea 
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="How did your pet go missing? What were they doing?"
                      value={circumstances}
                      onChange={(e) => setCircumstances(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
            )}

            {currentStep === 2 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Contact Info</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                      <Input
                        id="contactname"
                        label="Your Name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        id="contactno"
                        label="Contact Number"
                        type="text"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        id="contactemail"
                        label="Contact Email"
                        type="text"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        id="emergencyno"
                        label="Emergency Number"
                        type="text"
                        value={emergencyNo}
                        onChange={(e) => setEmergencyNo(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 mb-5">
                      <h4 className="text-xl font-semibold mb-5  mt-3 text-gray-700">Alert Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <label className="bg-gray-100 p-3 rounded-md"><input
                          id="smspreference"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isSMSChecked}
                          onChange={(e) => setIsSMSChecked(e.target.checked)}
                        />&nbsp;&nbsp;SMS Alert</label>
                        <label className="w-full bg-gray-100 p-3 rounded-md"><input
                          id="emailpreference"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isEmailChecked}
                          onChange={(e) => setIsEmailChecked(e.target.checked)}
                        />&nbsp;&nbsp;Email Notification</label>
                        <label className="w-full bg-gray-100 p-3 rounded-md"><input
                          id="smspreference"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isSocialChecked}
                          onChange={(e) => setIsSocialChecked(e.target.checked)}
                        />&nbsp;&nbsp;Social Media Sharing</label>
                        <label className="w-full bg-gray-100 p-3 rounded-md"><input
                          id="smspreference"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isWPChecked}
                          onChange={(e) => setIsWPChecked(e.target.checked)}
                        />&nbsp;&nbsp;Community WhatsApp Groups</label>
                      </div>
                    </div>
                  </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Medical Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="microchipid"
                      label="Microchip ID"
                      type="text"
                      value={microchipID}
                      onChange={(e) => setMicrochipId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="veterinarian"
                      label="Veterinarian"
                      type="text"
                      value={veterinarian}
                      onChange={(e) => setVeterinarian(e.target.value)}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Medical Conditions & Medications
                    </label>
                    <textarea 
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Any ongoing medical conditions, required medications, allergies, etc."
                      value={medicalCondition}
                      onChange={(e) => setMedicalCondition(e.target.value)}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Special Instructions
                    </label>
                    <textarea 
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Behavioral notes, approach instructions, etc."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  key="prev-button"
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  key="next-button"
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold transition-colors duration-300 hover:bg-green-700"
                >
                  Next
                </button>
              ) : (
                <button
                key="submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-green-600 text-white rounded-lg font-semibold transition-colors duration-300
  ${
  isSubmitting
    ? 'bg-green-300 cursor-not-allowed'
    : 'hover:bg-green-700'
}`}
                >
                  { isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              )}
            </div>
          </form>
        )}

        {reportType === 'found' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Found Pet Report</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Pet Photo 📸</label>
              <p className="text-sm text-gray-500 mb-2">Photo gallery (max {MAX_PHOTOS}). First primary photo is used for AI.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Compression target</span>
                  <input
                    type="number"
                    min={50}
                    max={800}
                    value={compressTargetKb}
                    onChange={(e) => setCompressTargetKb(e.target.value)}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm"
                  />
                  <span className="text-xs text-gray-500">KB</span>
                </div>
                <button
                  type="button"
                  disabled={compressing || foundPetPhotos.length === 0}
                  onClick={() => compressPhotosNow("found")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  {compressing ? "Compressing…" : "Compress now"}
                </button>
              </div>
              {photoUploadInfo && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {photoUploadInfo}
                </div>
              )}
              {photoUploadError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {photoUploadError}
                </div>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {foundPetPhotos.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover rounded-lg bg-gray-100" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {(file.size / 1024).toFixed(0)}KB
                    </span>
                    {foundPrimaryPhotoIndex === idx ? (
                      <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full">Primary</span>
                    ) : (
                      <button type="button" onClick={() => setFoundPrimary(idx)} className="absolute bottom-1 left-1 bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 rounded-full border hover:bg-white">Set primary</button>
                    )}
                    <button type="button" onClick={() => removeFoundPhoto(idx)} className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs px-1.5 rounded">✕</button>
                  </div>
                ))}
                {foundPetPhotos.length < MAX_PHOTOS && (
                  <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer text-gray-400 text-sm">
                    + Add
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addFoundPhoto(f); e.target.value = ''; }} />
                  </label>
                )}
              </div>
              {foundPetPhotos.length > 0 && (
                <button type="button" onClick={() => runAIDetection('found')} disabled={isAnalyzing} className="mt-3 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                  {isAnalyzing ? 'Analyzing…' : 'Analyze primary photo with AI'}
                </button>
              )}
              {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 font-medium">🤖 AI is analyzing your image...</span>
                  </div>
                </div>
              )}
              {foundPetDetection && !isAnalyzing && (
                <div
                  className={`mt-4 p-4 rounded-lg border-2 ${foundPetDetection.detected
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                    }`}
                >
                  {foundPetDetection.detected ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <span className="text-lg font-bold text-green-800">
                          Pet Detected!
                        </span>
                      </div>
                      <div className="space-y-1 text-green-700">
                        {foundPetDetection.type && (
                          <p><strong>Type:</strong> {foundPetDetection.type}</p>
                        )}
                        {foundPetDetection.breed && (
                          <p><strong>Breed:</strong> {foundPetDetection.breed}</p>
                        )}
                        {foundPetDetection.color && (
                          <p><strong>Color:</strong> {foundPetDetection.color}</p>
                        )}
                        <p><strong>Confidence:</strong> {foundPetDetection.confidence}%</p>
                      </div>
                      {foundPetDetection.breeds && foundPetDetection.breeds.length > 0 && (
                        <div className="mt-3">
                          <p className="font-semibold text-green-800 mb-2">🏷️ AI Breed Predictions:</p>
                          <div className="space-y-2">
                            {foundPetDetection.breeds.map((breed, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2">
                                <span className={idx === 0 ? 'font-semibold text-green-900' : 'text-green-700'}>
                                  {idx + 1}. {breed.breed}
                                </span>
                                <span className={`${idx === 0 ? 'font-bold' : ''} text-green-600`}>
                                  {breed.confidence}%
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-green-600 mt-2">
                            💡 This information can help identify the owner!
                          </p>
                        </div>
                      )}
                      {foundPetDetection.confidence < MIN_CONFIDENCE_FOR_AUTOFILL && (
                        <p className="mt-3 text-sm text-amber-700 font-medium">
                          We couldn&apos;t confidently detect breed. Please select manually.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚠️</span>
                        <span className="text-lg font-bold text-yellow-800">
                          No Pet Detected
                        </span>
                      </div>
                        <p className="text-yellow-700 text-sm mb-2">
                          The AI could not identify a pet in this image. Please upload a clear photo of a dog, cat, bird, rabbit, or other pet.
                        </p>
                        <p className="text-xs text-yellow-600">
                          💡 Tip: Make sure the pet is clearly visible and well-lit in the photo.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: single column so labels and fields don't overlay */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 mt-8 sm:mt-10">
              <div>
                <Input
                  id="foundpetlocation"
                  label="Where did you find the pet?"
                  type="text"
                  value={foundLocation}
                  onChange={(e) => setFoundLocation(e.target.value)}
                />
              </div>
              <div>
                <Input
                  id="foundpetdate"
                  label="Date Found"
                  type="date"
                  value={foundDate}
                  onChange={(e) => setFoundDate(e.target.value)}
                  className="hide-date-time"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Pet Condition
                </label>
                <select 
                  value={petCondition}
                  onChange={(e) => setPetCondition(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                >
                  <option>Select Condition</option>
                  <option>Excellent Health</option>
                  <option>Good Health</option>
                  <option>Injured/Needs Care</option>
                  <option>Critical Condition</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Pet Description
                </label>
                <textarea 
                  className="w-full h-20 bg-gray-100 rounded-lg p-2"
                  placeholder="Breed, size, color, distinctive features, behavior..."
                  value={petDescription}
                  onChange={(e) => setPetDescription(e.target.value)}
                />
              </div>
              <div className="lg:col-span-2">
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Current Care Arrangements
                </label>
                <textarea 
                  className="w-full h-20 bg-gray-100 rounded-lg p-2"
                  placeholder="Where is the pet now? Can you provide temporary care?"
                  value={careArrangement}
                  onChange={(e) => setCareArrangement(e.target.value)}
                />
              </div>
              <div className="lg:col-span-2 mb-5">
                <h4 className="text-xl font-semibold mb-2 mt-3 text-gray-600">Your Contact Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
                  <div>
                    <Input
                      id="foundercontactname"
                      label="Your Name"
                      type="text"
                      value={foundersName}
                      onChange={(e) => setFoundersName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="founderphone"
                      label="Your Phone Number"
                      type="text"
                      value={foundersPhoneNO}
                      onChange={(e) => setFoundersPhoneNo(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="foundersemail"
                      label="Your Email"
                      type="text"
                      value={foundersEmail}
                      onChange={(e) => setFoundersEmail(e.target.value)}
                    />
                  </div>
                </div>
                
              </div>
              
            </div>

            <button
              key="submit-button"
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg active:bg-green-500 hover:bg-green-700 font-semibold ${
                    isSubmitting
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'hover:bg-green-600'
                  }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Found Pet Report"}
            </button>
          </form>
        )}
      </div>
      {/* Notification Render */}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
