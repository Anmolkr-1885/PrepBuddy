import axiosInstance from "./axios.js"; // adjust path to wherever your file lives

export async function executeCode(language, code, stdin = "") {
  // console.log("request is goin to backend")
  try {
    const { data } = await axiosInstance.post("/execute", {
      language,
      code,
      stdin,
    });
    console.log(data);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || `Failed to execute code: ${error.message}`,
    };
  }
}