export async function submitReport(requestOptions) {
  try {
    const response = await fetch(
      "/api/v1/pet/report",
      {
        ...requestOptions,
        method: "POST",
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("Pet reported successfully");
    }

    return { response, result };
  } catch (error) {
    console.log("Submit report failed:", error);
    throw error;
  }
}
