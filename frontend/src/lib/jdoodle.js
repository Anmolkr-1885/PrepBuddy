import axiosInstance from "./axios.js";

export async function executeCode(language, code, stdin = "") {
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
      error:
        error.response?.data?.error ||
        `Failed to execute code: ${error.message}`,
    };
  }
}