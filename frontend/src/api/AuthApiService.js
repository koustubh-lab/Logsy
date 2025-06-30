import apiClient from "./AxiosApiService";

export function registerUserApi(data) {
  return apiClient.post("/register", data)
}