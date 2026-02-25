import api from "./axiosInstance";

// Register user
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// Login user
export const loginUser = async (data) => {
  const response = await api.post("/auth/authenticate", data);

  // save JWT token
  localStorage.setItem("tailsToken", response.data.token);

  return response.data;
};

// Validate token (GET with Authorization header) - use after sign in/sign up
export const validateToken = () => {
  return api.get("/auth/validate-token");
};

// Forgot password - POST with { email }, resets password and sends via email
export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};
