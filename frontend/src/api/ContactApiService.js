import apiClient from "./AxiosApiService";

export const sendContactRequestApi = (formData) => {
  return apiClient.post("/api/contact-admin", formData);
};