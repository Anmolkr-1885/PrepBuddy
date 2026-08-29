// frontend: executeCode.js
// Calls YOUR backend (via the shared axiosInstance), which securely talks to JDoodle.
// No API keys live here — this is safe to ship to the browser.

import axiosInstance from "./axios.js"; // adjust path to wherever your file lives

/**
 * @param {string} language - programming language ("javascript" | "python" | "java")
 * @param {string} code - source code to execute
 * @param {string} [stdin] - optional input for the program
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code, stdin = "") {
  try {
    const { data } = await axiosInstance.post("/execute", {
      language,
      code,
      stdin,
    });

    return data; // already shaped as { success, output, error }
  } catch (error) {
    // axios throws on non-2xx responses — the backend's error message
    // (if any) lives in error.response.data
    return {
      success: false,
      error:
        error.response?.data?.error ||
        `Failed to execute code: ${error.message}`,
    };
  }
}