import { sendLoginRequest } from "@/api/AuthApiService"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "@/context/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({ email: "" })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/home/dashboard")
    }
  }, [isAuthenticated, authLoading])

  const validateForm = () => {
    const newErrors = { email: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await sendLoginRequest(email)
      const { status } = response
      if (status === 200) {
        toast.info("Login Mail Sent", {
          description: "Click on the link inside the received mail to login",
          action: {
            label: "Open Gmail",
            onClick: () => window.open("https://mail.google.com", "_blank"),
          },
        })
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data)
      } else if (error.request) {
        toast.error("Ensure that you have a stable internet connection")
      } else {
        toast.error("Server error")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 appear-animation">
      <motion.div
        className="max-w-md mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card className="border-none shadow-none sm:shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-center">
                Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to login to your account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  ref={inputRef}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, ["email"]: "" }))
                  }}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div variants={itemVariants} className="w-full">
                <Button
                  type="submit"
                  className={`w-full ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {loading ? "Please wait..." : "Send Login Mail"}
                </Button>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="text-center text-sm"
              >
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
