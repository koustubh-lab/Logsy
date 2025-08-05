import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://logsy-backend.onrender.com",
})

export default apiClient