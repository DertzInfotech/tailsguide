"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPetById,
  getPetMedicalRecords,
  postPetMedicalRecord,
  getPetMedicalDocument,
  deletePetMedicalRecord,
} from "@/api/petApi";

const RECORD_TYPES = [
  "Vaccination",
  "Medical history",
  "Lab results",
  "Prescription",
  "Insurance",
  "Other",
];

function formatDate(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return str;
  }
}

export default function PetMedicalPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.petId;

  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [recordType, setRecordType] = useState("Vaccination");
  const [title, setTitle] = useState("");
  const [dateAdministered, setDateAdministered] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPet = async () => {
    if (!petId) return;
    try {
      const res = await getPetById(petId);
      setPet(res.data);
    } catch (e) {
      console.error("Failed to load pet", e);
      setError("Failed to load pet");
    }
  };

  const fetchRecords = async () => {
    if (!petId) return;
    try {
      const res = await getPetMedicalRecords(petId);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load medical records", e);
      setRecords([]);
    }
  };

  useEffect(() => {
    if (!petId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      await fetchPet();
      await fetchRecords();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [petId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!petId) return;
    if (!documentFile || !(documentFile instanceof File)) {
      setUploadError("Please select a document to upload.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const recordDTO = {
        petId: Number(petId),
        recordType: recordType || "Other",
        title: title.trim() || documentFile.name,
        dateAdministered: dateAdministered || null,
        nextDueDate: nextDueDate || null,
        notes: notes.trim() || null,
      };
      await postPetMedicalRecord(petId, recordDTO, documentFile);
      setToast("Document uploaded.");
      setShowUpload(false);
      setTitle("");
      setDateAdministered("");
      setNextDueDate("");
      setNotes("");
      setDocumentFile(null);
      await fetchRecords();
    } catch (err) {
      const msg =
        err.response?.data?.businessErrorDescription ||
        err.response?.data?.message ||
        "Upload failed. Please try again.";
      setUploadError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = async (recordId) => {
    try {
      const res = await getPetMedicalDocument(recordId);
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      console.error("Failed to load document", e);
      setToast("Could not open document.");
    }
  };

  const handleDownloadDocument = async (recordId) => {
    try {
      const res = await getPetMedicalDocument(recordId);
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-document-${recordId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download document", e);
      setToast("Could not download document.");
    }
  };

  const handleDelete = async (recordId) => {
    try {
      setDeletingId(recordId);
      await deletePetMedicalRecord(recordId);
      setToast("Record deleted.");
      setRecordToDelete(null);
      await fetchRecords();
    } catch (e) {
      console.error("Failed to delete record", e);
      setToast("Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!petId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 p-4 sm:p-6">
        <p className="text-gray-600">Invalid pet.</p>
        <Link href="/my-pet" className="text-amber-600 hover:underline mt-2 inline-block">Back to My Pets</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-amber-200/50 rounded-lg animate-pulse mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/80 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 p-4 sm:p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/my-pet" className="text-amber-600 hover:underline mt-2 inline-block">Back to My Pets</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link
              href="/my-pet"
              className="text-sm text-amber-700 hover:text-amber-800 font-medium mb-1 inline-block"
            >
              ← My Pets
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Medical records {pet?.petName ? `· ${pet.petName}` : ""}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#fa7c15] to-amber-500 text-white font-semibold shadow-lg shadow-orange-200/40 hover:shadow-xl hover:shadow-orange-300/40 transition"
          >
            <span>+</span> Upload document
          </button>
        </div>

        {toast && (
          <div
            className="mb-4 py-3 px-4 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 text-sm"
            role="alert"
          >
            {toast}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {records.length === 0 && !showUpload ? (
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-amber-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4">
              📋
            </div>
            <p className="text-gray-600 mb-4">No medical records yet.</p>
            <p className="text-sm text-gray-500 mb-6">Upload vaccination records, medical history, or any pet-related documents.</p>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="px-5 py-2.5 rounded-xl bg-[#fa7c15] text-white font-medium hover:bg-amber-600 transition"
            >
              Upload document
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {records.map((rec) => (
              <li
                key={rec.id}
                className="bg-white rounded-xl border border-amber-100/80 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">{rec.title || rec.recordType || "Record"}</p>
                  <p className="text-sm text-amber-700">{rec.recordType}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {rec.dateAdministered && `Administered: ${formatDate(rec.dateAdministered)}`}
                    {rec.nextDueDate && ` · Next: ${formatDate(rec.nextDueDate)}`}
                  </p>
                  {rec.notes && <p className="text-sm text-gray-600 mt-1">{rec.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDocument(rec.id)}
                    className="px-3 py-2 rounded-lg border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-50 transition"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDocument(rec.id)}
                    className="px-3 py-2 rounded-lg border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-50 transition"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecordToDelete(rec)}
                    disabled={deletingId === rec.id}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    {deletingId === rec.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Delete confirmation popup */}
        {recordToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !deletingId && setRecordToDelete(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="delete-dialog-title" className="text-lg font-semibold text-gray-800 mb-2">
                Delete document?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete &quot;{recordToDelete.title || recordToDelete.recordType || "this record"}&quot;? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  disabled={!!deletingId}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(recordToDelete.id)}
                  disabled={!!deletingId}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deletingId === recordToDelete.id ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !uploading && setShowUpload(false)}>
            <div
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload medical document</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    required
                  >
                    {RECORD_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual vaccination"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date administered</label>
                    <input
                      type="date"
                      value={dateAdministered}
                      onChange={(e) => setDateAdministered(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next due date</label>
                    <input
                      type="date"
                      value={nextDueDate}
                      onChange={(e) => setNextDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Optional notes"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document file *</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-amber-100 file:text-amber-800"
                  />
                </div>
                {uploadError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    disabled={uploading}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !documentFile}
                    className="px-5 py-2.5 rounded-xl bg-[#fa7c15] text-white font-semibold hover:bg-amber-600 disabled:opacity-60 transition"
                  >
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
