import apiClient from "./AxiosApiService";

export const sendLoginRequest = (email) => {
  return apiClient.post("/api/request-email-login", {email})
}

export const sendActivationRequest = (token) => {
  return apiClient.post("/api/validate-activation-magic-link", {token})
}