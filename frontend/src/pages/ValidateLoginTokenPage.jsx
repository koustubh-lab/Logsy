import BarsLoader from "@/components/BarLoader"
import FancyFailureComponent from "@/components/FancyFailureComponent"
import FancySuccessComponent from "@/components/FancySuccessComponent"
import useAuth from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function ValidateLoginTokenPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    validateLoginToken()
  }, [token])

  async function validateLoginToken() {
    try {
      const status = await login(token)
      if (status === 200) {
        setLoading(false)
        setIsAuthenticated(true)
        setTimeout(() => {
          navigate("/home/dashboard", { replace: true })
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen grid place-content-center">
      {loading ? (
        <div className="grid justify-items-center gap-3">
          <BarsLoader />
          <p className="text-muted-foreground">
            Account validation in-progress
          </p>
        </div>
      ) : isAuthenticated ? (
        <div className="grid gap-8 justify-items-center text-center px-10">
          <FancySuccessComponent />
          <div>
            <h1 className="font-bold text-2xl">Validation Complete</h1>
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 justify-items-center text-center px-10">
          <FancyFailureComponent />
          <div>
            <h1 className="font-bold text-2xl">Login Failed</h1>
          </div>
        </div>
      )}
    </div>
  )
}
