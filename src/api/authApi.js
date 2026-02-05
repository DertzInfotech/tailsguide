import api from "./axiosInstance";

// Register user
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// Login user
export const loginUser = async (data) => {
  const response = await api.post("/auth/authenticate", data);

  // save JWT token
  localStorage.setItem("token", response.data.token);

  return response.data;
};

// Validate token (optional but useful)
export const validateToken = () => {
  return api.get("/auth/validate-token");
};
