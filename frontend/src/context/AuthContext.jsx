import apiClient from "@/api/AxiosApiService"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  function register(data) {
    return apiClient.post("/api/register", data)
  }

  async function login(email, password) {
    try {
      const response = await apiClient.post(
        "/api/login",
        {},
        {
          headers: {
            Authorization: `Basic ${window.btoa(`${email}:${password}`)}`,
          },
        }
      )
      console.log("response:", response)
      const { status } = response
      if (status !== 200) throw new Error("HTTP status code: " + status)

      const {
        data: { token },
      } = response
      setToken(token)

      if (localStorage) {
        localStorage.setItem("token", token)
      }

      return status
    } catch (error) {
      throw new Error(error.message)
    }
  }

  useEffect(() => {
    if (!localStorage) return

    const existingToken = localStorage.getItem("token")
    if (!existingToken) return

    setToken(existingToken)
  }, [])

  return (
    <AuthContext.Provider
      value={{ token, register, login, userEmail, setUserEmail }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
