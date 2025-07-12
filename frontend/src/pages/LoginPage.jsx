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
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })
  const inputRef = useRef(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    try {
      const status = await login(email, password)
      if (status === 200) {
        toast.success("Logged-in Successfully")
        setTimeout(() => {
          navigate("/home/dashboard")
        }, 1000)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 appear-animation">
      <motion.div
        className="max-w-md mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card className="border-none shadow-2xl backdrop-blur-sm">
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
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, ["password"]: "" }))
                  }}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div variants={itemVariants} className="w-full">
                <Button type="submit" className="w-full">
                  Login
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
