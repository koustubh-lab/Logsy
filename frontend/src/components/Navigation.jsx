import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

gsap.registerPlugin(ScrollTrigger)

export function Navigation() {
  /* const navRef = useRef(null)
  const logsyRef = useRef(null)
  const loginRef = useRef(null)
  const registerRef = useRef(null)

  useLayoutEffect(() => {
    const startPoint = `${window.innerHeight} top`

    // Nav resizing on scroll
    gsap.to(navRef.current, {
      scrollTrigger: {
        trigger: document.body,
        start: "top+=60 top",
        end: "bottom top",
        scrub: true,
      },
      width: "40%",
      margin: "10px",
      borderRadius: "50px",
      border: "0.5px solid gray",
      ease: "power2.out",
    })

    // Individual ScrollTriggers for color/style changes
    ScrollTrigger.create({
      trigger: document.body,
      start: startPoint,
      toggleClass: { targets: logsyRef.current, className: "logsy-scrolled" },
    })

    ScrollTrigger.create({
      trigger: document.body,
      start: startPoint,
      toggleClass: { targets: loginRef.current, className: "login-scrolled" },
    })

    ScrollTrigger.create({
      trigger: document.body,
      start: startPoint,
      toggleClass: {
        targets: registerRef.current,
        className: "register-scrolled",
      },
    })
  }, []) */

  return (
    <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full mx-auto z-50 backdrop-blur-md text-gray-900 transition-all duration-300">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:px-10">
          <Link to="/" className="text-2xl font-semibold text-white">
            <h2>Logsy</h2>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="p-3 py-2 shadow-md bg-white rounded-lg">
                  Menu
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/login" className="w-full">
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/register" className="w-full">
                    Register
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
