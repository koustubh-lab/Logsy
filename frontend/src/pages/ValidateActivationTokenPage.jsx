import { sendActivationRequest } from "@/api/AuthApiService"
import BarsLoader from "@/components/BarLoader"
import FancyFailureComponent from "@/components/FancyFailureComponent"
import FancySuccessComponent from "@/components/FancySuccessComponent"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function ValidateActivationTokenPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  async function validateLoginToken() {
    try {
      if (!token) {
        setIsAuthenticated(false)
      }
      const response = await sendActivationRequest(token)
      const { status } = response
      if (status === 200) {
        setLoading(false)
        setIsAuthenticated(true)
        toast.info("Account Activation!!", {
          action: {
            label: "Go to Login Page",
            onClick: () => navigate("/login", { replace: true }),
          },
          duration: 10000,
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    validateLoginToken()
  }, [token])

  return (
    <div className="h-screen grid place-content-center">
      {loading ? (
        <div className="grid justify-items-center gap-3">
          <BarsLoader />
        </div>
      ) : isAuthenticated ? (
        <div className="grid gap-8 justify-items-center text-center px-10">
          <FancySuccessComponent />
          <div>
            <h1 className="font-bold text-2xl">Validation Complete</h1>
            <p className="text-muted-foreground">Account Activated</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 justify-items-center text-center px-10">
          <FancyFailureComponent />
          <div>
            <h1 className="font-bold text-2xl">Validation Failed</h1>
          </div>
        </div>
      )}
    </div>
  )
}
