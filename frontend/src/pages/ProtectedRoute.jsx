import BarsLoader from "@/components/BarLoader"
import useAuth from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) return <BarsLoader />

  return token ? children : <Navigate to="/login" replace />
}
