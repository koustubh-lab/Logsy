import useAuth from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

const { isAuthenticated, loading } = useAuth()
const navigate = useNavigate()

export function handleRedirection() {
  if (!loading && isAuthenticated) {
    navigate("/home/dashboard")
  }
}