export async function submitReport(requestOptions = {}) {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("tailsToken") : null;

    const headers = {
      ...(requestOptions.headers || {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set multipart boundary when body is FormData
    if (typeof FormData !== "undefined" && requestOptions.body instanceof FormData) {
      delete headers["Content-Type"];
      delete headers["content-type"];
    }

    const response = await fetch("/api/v1/pet/report", {
      ...requestOptions,
      method: "POST",
      headers,
    });

    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (response.ok) {
      console.log("Pet reported successfully");
    }

    return { response, result };
  } catch (error) {
    console.log("Submit report failed:", error);
    throw error;
  }
}
