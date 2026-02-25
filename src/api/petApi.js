import api from "./axiosInstance";

export const reportPet = (petData, photoFile = null, additionalPhotos = []) => {
  const formData = new FormData();

  formData.append(
    "petDTO",
    new Blob([JSON.stringify(petData)], {
      type: "application/json",
    })
  );

  // Primary photo (required for thumbnail/primary display)
  if (photoFile instanceof File) {
    formData.append("photos", photoFile);
  }

  // Additional photos (up to 4 more, max 5 total)
  if (Array.isArray(additionalPhotos)) {
    additionalPhotos.forEach((file) => {
      if (file instanceof File) {
        formData.append("photos", file); // Multiple files with same field name
      }
    });
  }

  return api.post("/pet/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/* -----------------------------------------
   FETCHING
------------------------------------------ */
export const getPets = (page = 0, size = 10) =>
  api.get(`/pet?page=${page}&size=${size}`);

export const getPetById = (id) =>
  api.get(`/pet/${id}`);

export const getMyPets = () =>
  api.get("/pet/my-pets");

export const getAllPets = () =>
  api.get("/pet/all");

/** Search/list pets with pagination (for search page). Backend may not support filter params; filter client-side. */
export const getSearchPets = (page = 0, size = 50, sortBy = "lastSeenDate", sortDirection = "desc") =>
  api.get(`/pet/all?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);

/** GET potential matches for a lost pet by pet id. Returns array of pets that may match. */
export const getPetMatches = (petId) =>
  api.get(`/pet/${petId}/matches`);

export const getPetThumbnail = (id) =>
  api.get(`/pet/${id}/thumbnail`, { responseType: "blob" });

export const getPetPhoto = (id) =>
  api.get(`/pet/${id}/photo`, { responseType: "blob" });

export const getPetFlyerPdf = (id) =>
  api.get(`/pet/${id}/flyer-pdf`, { responseType: "blob" });

export const getPetCollarQr = (id) =>
  api.get(`/pet/${id}/collar-qr`, { responseType: "blob", headers: { Accept: "application/pdf" } });

/** POST scan data when someone scans the pet's collar QR. Body can include lastSeenLocation, tempOwnerName, tempOwnerPhone or backend-specific fields. Returns pet object (200). */
export const postPetScan = (petId, data) =>
  api.post(`/pet/${petId}/scan`, data);

export const deletePet = (id) =>
  api.delete(`/pet/${id}`);

/** Update pet (e.g. mark as found) - partial update */
export const updatePet = (id, updates) =>
  api.patch(`/pet/${id}`, updates);

/** Mark pet as found (sets reportType to FOUND) */
export const markPetFound = (petId) =>
  api.patch(`/pet/${petId}`, { reportType: "FOUND" });

/** Delete a single media item (photo) by mediaId */
export const deletePetMedia = (mediaId) =>
  api.delete(`/pet/media/${mediaId}`);

/* -----------------------------------------
   MEDICAL RECORDS
------------------------------------------ */
/** GET list of medical records for a pet */
export const getPetMedicalRecords = (petId) =>
  api.get(`/pet/medical/${petId}`);

/** POST new medical record: multipart recordDTO + document file */
export const postPetMedicalRecord = (petId, recordDTO, documentFile) => {
  const formData = new FormData();
  formData.append("recordDTO", new Blob([JSON.stringify(recordDTO)], { type: "application/json" }));
  if (documentFile instanceof File) {
    formData.append("document", documentFile, documentFile.name);
  }
  return api.post(`/pet/medical/${petId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** GET document file for a medical record (returns blob) */
export const getPetMedicalDocument = (recordId) =>
  api.get(`/pet/medical/${recordId}/document`, { responseType: "blob" });

/** DELETE a medical record (API: DELETE /pet/medical/{recordId}) */
export const deletePetMedicalRecord = (recordId) =>
  api.delete(`/pet/medical/${recordId}`);

/* -----------------------------------------
   SIGHTINGS (spotted / report seen)
------------------------------------------ */
/** GET sightings for a pet */
export const getPetSightings = (petId) =>
  api.get(`/pet/sightings/${petId}`);

/** POST new sighting: multipart sightingDTO + photo */
export const postPetSighting = (petId, sightingDTO, photoFile = null) => {
  const formData = new FormData();
  formData.append(
    "sightingDTO",
    new Blob([JSON.stringify(sightingDTO)], { type: "application/json" })
  );
  if (photoFile instanceof File) {
    formData.append("photo", photoFile, photoFile.name);
  }
  return api.post(`/pet/sightings/${petId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** GET sighting photo (blob) */
export const getSightingPhoto = (sightingId) =>
  api.get(`/pet/sightings/${sightingId}/photo`, { responseType: "blob" });
