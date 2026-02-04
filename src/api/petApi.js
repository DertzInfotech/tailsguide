import api from "./axiosInstance";

/* -----------------------------------------
   CREATE + UPDATE PET (REGISTER / EDIT)
------------------------------------------ */
export const reportPet = (petData, photoFile = null) => {
  const formData = new FormData();

  // petDTO (JSON)
  formData.append(
    "petDTO",
    new Blob([JSON.stringify(petData)], {
      type: "application/json",
    })
  );

  // photo (OPTIONAL but REQUIRED for update if changed)
  if (photoFile instanceof File) {
    formData.append("photo", photoFile);
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
