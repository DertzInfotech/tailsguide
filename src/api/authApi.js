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

// Validate token 
export const validateToken = () => {
  return api.get("/auth/validate-token");
};

//Forget password
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      "http://64.225.84.126:8084/api/v1/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send reset email");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

