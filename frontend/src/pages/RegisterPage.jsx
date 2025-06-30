import { registerUserApi } from "@/api/AuthApiService"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function RegisterPage() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})

  const validateInputs = () => {
    const errors = {}

    if (!formData.username || formData.username.length < 6)
      errors.username = "Username must be at least 6 characters"

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Please enter a valid email"

    if (!formData.password || formData.password.length < 8)
      errors.password = "Password must be at least 8 characters"

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match"

    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    const errors = validateInputs()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      const {username, password, email} = formData
      const response = await registerUserApi({username, password, email})
      if (response.status === 200) {
        toast.success("Account Created !!!", {
          action: {
            label: "Go to login",
            onClick: () => navigate("/login"),
          },
        })
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 grid place-content-center">
      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join our community of developers</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <Label htmlFor="name">User Name</Label>
                <Input
                  id="name"
                  name="username"
                  type="text"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                {formErrors?.username && (
                  <p className="text-red-500 text-sm pl-2">
                    {formErrors.username}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {formErrors?.email && (
                  <p className="text-red-500 text-sm pl-2">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {formErrors?.password && (
                  <p className="text-red-500 text-sm pl-2">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {formErrors?.confirmPassword && (
                  <p className="text-red-500 text-sm pl-2">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  required
                  value={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className={`w-full ${
                  (!termsAccepted || isLoading) &&
                  "opacity-50 pointer-events-none"
                }`}
              >
                {isLoading ? "Processing" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
