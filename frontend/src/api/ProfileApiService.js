import apiClient from "./AxiosApiService"

export const getProfileApi = () => {
  return apiClient.get("/api/profile")
}

export const updateProfilePictureApi = (formData) => {
  return apiClient.post("/api/upload-profile-picture", formData)
}

export const updateProfileDetailsApi = (payload) => {
  return apiClient.post("/api/update-profile-details", payload)
}
export const updatePersonalDetailsApi = (payload) => {
  return apiClient.post("/api/update-personal-details", payload)
}
export const updateAccountDetailsApi = (payload) => {
  return apiClient.post("/api/update-account-details", payload)
}

export const deleteAccountApi = () => {
  return apiClient.delete("/api/delete-account")
}