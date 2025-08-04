import BarsLoader from "@/components/BarLoader"
import useAuth from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { token, loading, isAuthenticated } = useAuth()

  if (loading) return <BarsLoader />
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return token ? children : <Navigate to="/login" replace />
}
