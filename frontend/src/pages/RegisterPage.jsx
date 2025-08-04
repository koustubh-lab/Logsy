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
import useAuth from "@/context/AuthContext"
import { Filter } from "bad-words"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 0.7,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export default function RegisterPage() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const filter = new Filter()

  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/home/dashboard")
    }
  }, [isAuthenticated, authLoading])

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  const [formErrors, setFormErrors] = useState({})

  const validateInputs = () => {
    const errors = {}
    if (
      !formData.username ||
      formData.username.length < 6 ||
      formData.username.match(/$[a-z A-Z]^/)
    )
      errors.username =
        "Username must be at least 6 characters and can contain only letters"

    if (filter.isProfane(formData.username))
      errors.username = "Inappropriate words are not allowed in usernames."

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Please enter a valid email"

    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const condition = name === "username"
    let newValue

    if (condition) {
      newValue = value
        .split(" ")
        .map((word) =>
          word.substring(0, 1).toUpperCase().concat(word.substring(1))
        )
        .join(" ")
    }

    setFormData((prev) => ({ ...prev, [name]: condition ? newValue : value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const errors = validateInputs()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      const { username, email } = formData
      const response = await register({ username, email })
      if (response.status === 200) {
        toast.success("Account Created 🎉", {
          description:
            "But To activate your account, click the link in your Gmail Inbox",
          action: {
            label: "Open Gmail",
            onClick: () => window.open("https://mail.google.com", "_blank"),
          },
        })
        setFormData({ username: "", email: "" })
      }
    } catch {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-content-center bg-muted/40">
      <motion.div
        className="max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card className="border-none shadow-none sm:shadow-2xl sm:backdrop-blur-sm">
          <CardHeader className="text-center space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Join our community of developers
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {[
                {
                  id: "name",
                  name: "username",
                  type: "text",
                  label: "Display Name",
                  placeholder: "John Doe",
                },
                {
                  id: "email",
                  name: "email",
                  type: "email",
                  label: "Email",
                  placeholder: "your@email.com",
                },
              ].map((field) => (
                <motion.div variants={itemVariants} key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors?.[field.name] && (
                    <p className="text-sm text-destructive pl-1">
                      {formErrors[field.name]}
                    </p>
                  )}
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id="terms"
                  required
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                />
                <Label htmlFor="terms" className="text-sm leading-snug">
                  I agree to the{" "}
                  <Link to="/terms-and-conditions" className="text-blue-600 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-blue-600 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!termsAccepted || isLoading}
                >
                  {isLoading ? "Processing..." : "Send Verification Email"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              variants={itemVariants}
              className="text-center pt-4 text-sm text-gray-600"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 underline">
                Sign in
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/* const { name, value } = e.target
    const condition = name === "username"
    let newValue

    if (condition) {
      newValue = value
        .split(" ")
        .map((word) =>
          word.substring(0, 1).toUpperCase().concat(word.substring(1))
        )
        .join(" ")
    }

    setFormData((prev) => ({ ...prev, [name]: condition ? newValue : value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" })) */
