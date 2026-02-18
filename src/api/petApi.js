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
    formData.append("photo", photoFile);
  }

  // Additional photos (up to 4 more, max 5 total)
  if (Array.isArray(additionalPhotos)) {
    additionalPhotos.forEach((file) => {
      if (file instanceof File) {
        formData.append("photo", file); // Multiple files with same field name
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

export const getPetThumbnail = (id) =>
  api.get(`/pet/${id}/thumbnail`, { responseType: "blob" });

export const getPetPhoto = (id) =>
  api.get(`/pet/${id}/photo`, { responseType: "blob" });

export const getPetFlyerPdf = (id) =>
  api.get(`/pet/${id}/flyer-pdf`, { responseType: "blob" });

export const getPetCollarQr = (id) =>
  api.get(`/pet/${id}/collar-qr`, { responseType: "blob" });

export const deletePet = (id) =>
  api.delete(`/pet/${id}`);

/** Delete a single media item (photo) by mediaId */
export const deletePetMedia = (mediaId) =>
  api.delete(`/pet/media/${mediaId}`);
