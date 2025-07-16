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
    return apiClient.post("/api/request-account-registration", data)
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

  async function login(urlToken) {
    try {
      const response = await apiClient.post("/api/validate-login-magic-link", {
        token: urlToken,
      })
      console.log(response)
      const { status, data } = response
      if (status !== 200) throw new Error("HTTP status code: " + status)

      const { token: retrievedToken } = data
      if (!retrievedToken) return 401

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
        console.log("token expired")
      }
    } catch (error) {
      localStorage.removeItem("token")
      console.log("error in token decoding")
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
