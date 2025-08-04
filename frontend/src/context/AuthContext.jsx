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
    const validateToken = async () => {
      const existingToken = localStorage.getItem("token")
      if (!existingToken) {
        setToken(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        const { exp } = jwtDecode(existingToken)
        if (Date.now() < exp * 1000) {
          applyInterceptor(existingToken)
          setToken(existingToken)

          try {
            const res = await apiClient.get("/api/validate-login-token")

            if (res.status === 200) {
              setIsAuthenticated(true)
            } else {
              throw new Error("Token invalid on server")
            }
          } catch (err) {
            console.error("Backend validation failed:", err)
            localStorage.removeItem("token")
            setToken(null)
            setIsAuthenticated(false)
          }
        } else {
          localStorage.removeItem("token")
          console.log("Token expired")
          setIsAuthenticated(false)

          await apiClient.get("/api/wake-up")
        }
      } catch (error) {
        console.log("Error decoding token:", error)
        localStorage.removeItem("token")
        setToken(null)
        setIsAuthenticated(false)
      }

      setLoading(false)
    }

    validateToken()
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
