"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById, postPetSighting } from "@/api/petApi";

export default function ReportSpottedPage() {
  const { petId } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [sighterName, setSighterName] = useState("");
  const [sighterPhone, setSighterPhone] = useState("");
  const [location, setLocation] = useState("");
  const [sightingTime, setSightingTime] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await getPetById(petId);
        setPet(res.data);
      } catch {
        setToast({ type: "error", text: "Pet not found" });
      } finally {
        setLoading(false);
      }
    };
    if (petId) fetchPet();
  }, [petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sighterName.trim() || !sighterPhone.trim() || !location.trim()) {
      setToast({ type: "error", text: "Please fill name, phone, and location" });
      return;
    }
    setSubmitting(true);
    setToast(null);
    try {
      const sightingDTO = {
        sighterName: sighterName.trim(),
        sighterPhone: sighterPhone.trim(),
        location: location.trim(),
        sightingTime: sightingTime
          ? new Date(sightingTime).toISOString()
          : new Date().toISOString(),
        description: description.trim() || undefined,
      };
      await postPetSighting(petId, sightingDTO, photoFile || undefined);
      setToast({
        type: "success",
        text: "Thank you! Your report has been submitted. The pet owner may contact you.",
      });
      setSighterName("");
      setSighterPhone("");
      setLocation("");
      setSightingTime("");
      setDescription("");
      setPhotoFile(null);
      if (document.getElementById("photo-input")) {
        document.getElementById("photo-input").value = "";
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        text: err.response?.data?.message || "Failed to submit. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50/50 flex items-center justify-center">
        <p className="text-orange-800">Loading…</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-orange-50/50 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-orange-800">Pet not found.</p>
        <Link href="/" className="text-orange-600 hover:underline font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-orange-600 hover:underline font-medium"
          >
            ← Back to Lost & Found
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          I saw this pet
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          You&apos;re reporting a sighting of <strong>{pet.petName || "this pet"}</strong>.
          Your details will be shared with the owner so they can reach out.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sighterName}
              onChange={(e) => setSighterName(e.target.value)}
              placeholder="e.g. John"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={sighterPhone}
              onChange={(e) => setSighterPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Where did you see the pet? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Indiranagar, near Metro"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              When did you see them?
            </label>
            <input
              type="datetime-local"
              value={sightingTime}
              onChange={(e) => setSightingTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Any details? (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Pet was near the park, looked healthy"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (optional)
            </label>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-800 file:font-medium"
            />
          </div>

          {toast && (
            <div
              className={`p-3 rounded-lg text-sm ${
                toast.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {toast.text}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Submitting…" : "Submit report"}
            </button>
            <Link
              href="/"
              className="py-3 px-5 rounded-xl font-semibold text-orange-600 border-2 border-orange-500 hover:bg-orange-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
