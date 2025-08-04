import useAuth from "@/context/AuthContext"
import { useEffect } from "react"

export default function AuthRedirectHandler() {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // window.location.href = "/home/dashboard"
    }
  }, [loading, isAuthenticated])

  return null
}
