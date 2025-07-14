import apiClient from "@/api/AxiosApiService"
import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useRef, useState } from "react"

const AuthContext = createContext()

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const interceptorId = useRef(null)

  function register(data) {
    return apiClient.post("/api/register", data)
  }

  function applyInterceptor(token) {
    if (interceptorId.current !== null) {
      apiClient.interceptors.request.eject(interceptorId.current)
    }

    interceptorId.current = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = "Bearer " + token
      return config
    })
  }

  async function login(email, password) {
    try {
      const response = await apiClient.post("/api/login", { email, password })
      const { status } = response
      if (status !== 200) throw new Error("HTTP status code: " + status)

      const {
        data: { token: retrievedToken },
      } = response
      applyInterceptor(retrievedToken)
      setToken(retrievedToken)
      setIsAuthenticated(true)
      localStorage.setItem("token", retrievedToken)

      return status
    } catch (error) {
      throw new Error(error.message)
    }
  }

  function logout() {
    setToken(null)
    if (interceptorId.current !== null) {
      apiClient.interceptors.request.eject(interceptorId.current)
    }
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const existingToken = localStorage.getItem("token")
    if (!existingToken) {
      setToken(null)
      setLoading(false)
      return
    }

    try {
      const { exp } = jwtDecode(existingToken)
      if (Date.now() < exp * 1000) {
        applyInterceptor(existingToken)
        setIsAuthenticated(true)
        setToken(existingToken)
      } else {
        localStorage.removeItem("token")
      }
    } catch {
      localStorage.removeItem("token")
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ token, register, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
