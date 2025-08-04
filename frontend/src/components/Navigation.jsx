import { Button } from "@/components/ui/button"
import useAuth from "@/context/AuthContext"
import useIsMobile from "@/hooks/IsMobile"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Menu, MoveRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Separator } from "./ui/separator"

gsap.registerPlugin(ScrollTrigger)

export function Navigation() {
  const isMobile = useIsMobile()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const navItems = [
    { label: "Home", href: "#hero-section" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Posts", href: "#explore-posts" },
    { label: "Contact", href: "#contact" },
  ]

  const handleResize = () => {
    setMobileNavOpen(false)
  }

  useEffect(() => {
    if (!isMobile) {
      setMobileNavOpen(false)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/20 backdrop-blur-2xl text-white shadow-lg transition-all duration-300">
      <div className="mx-auto px-1">
        <div className="flex items-center justify-between h-16 px-6">
          <a
            href="/"
            className="text-xl sm:text-2xl font-semibold text-white flex gap-2 items-center"
          >
            <img
              src="/logsy-new-logo-compressed.png"
              alt=""
              className="w-8 h-8"
            />
            <h2>Logsy</h2>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="opacity-60 hover:opacity-100 duration-300 text-sm cursor-pointer"
              >
                {item.label}
              </a>
            ))}
            <Link to={isAuthenticated ? "/home/dashboard" : "/register"}>
              <Button className="rounded-full">
                <span className="flex gap-2 items-center">
                  {isAuthenticated ? "Dashboard" : "Sign Up"} <MoveRight />
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="bg-muted/40"
              size={isMobile ? "sm" : ""}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 h-screen bg-black/90 text-white transform transition-all duration-500 ease-in-out
        ${
          mobileNavOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }
        flex flex-col items-center justify-center space-y-8 backdrop-blur-xl`}
      >
        <button
          className="absolute top-5 right-5 text-white"
          onClick={() => setMobileNavOpen(false)}
        >
          <X size={28} />
        </button>

        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMobileNavOpen(false)}
            className="text-xl opacity-80 hover:opacity-100 transition duration-300"
          >
            {item.label}
          </a>
        ))}
        <Separator className="w-5/6 bg-white" />
        <Link
          to="/login"
          onClick={() => setMobileNavOpen(false)}
          className="text-xl opacity-80 hover:opacity-100 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setMobileNavOpen(false)}
          className="text-xl opacity-80 hover:opacity-100 transition duration-300"
        >
          Register
        </Link>
      </div>
    </nav>
  )
}
