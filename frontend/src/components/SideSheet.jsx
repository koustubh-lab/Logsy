import useAuth from "@/context/AuthContext"
import { Circle, Frown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

const OPEN_DELAY = 1000

export default function SideSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const lastClosedAtRef = useRef(null)
  const [startX, setStartX] = useState(null)
  const location = useLocation()
  const { logout } = useAuth()

  const tabOptions = "dashboard, profile, explore, create-post, logout".split(
    ", "
  )

  function handleLogoutAction() {
    logout()
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return

      const now = Date.now()
      const canOpen =
        !lastClosedAtRef.current || now - lastClosedAtRef.current > OPEN_DELAY

      if (canOpen && e.clientX > window.innerWidth - 10) {
        setIsOpen(true)
      }
    }

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        setStartX(e.touches[0].clientX)
      }
    }

    const handleTouchEnd = (e) => {
      if (startX == null) return
      const endX = e.changedTouches[0].clientX
      const diff = startX - endX

      if (startX > window.innerWidth - 50 && diff > 50) {
        setIsOpen(true)
      }
      setStartX(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [startX])

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (!open) {
      lastClosedAtRef.current = Date.now()
    }
  }

  useEffect(() => {
    setIsOpen(false)
    lastClosedAtRef.current = Date.now()
  }, [location.pathname])

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader className={"bg-slate-800 p-2 rounded-md"}>
          <SheetTitle>
            <div className="flex gap-2 items-center p-2">
              <img src="/logsy.svg" alt="Logsy" className="h-14 w-1h-14 " />
              <h1 className="text-3xl md:text-5xl text-white">Logsy</h1>
            </div>
          </SheetTitle>
          <SheetDescription className="text-muted">
            Select any of the options below to change current tab
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 mt-5">
          {tabOptions.map((tab) => (
            <div key={tab}>
              {tab === "logout" && <Separator className="my-2" />}
              {tab === "logout" ? (
                <Dialog>
                  <DialogTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      className={`justify-start capitalize w-full text-red-500 hover:text-red-500 hover:bg-red-200 duration-200`}
                    >
                      {tab}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Logout?</DialogTitle>
                      <DialogDescription>
                        You will have to login-in again to access your account
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid place-content-center p-4">
                      <Frown />
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleLogoutAction}
                      >
                        Logout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={`justify-start capitalize w-full ${
                    location.pathname.endsWith(tab) ? "bg-slate-100" : ""
                  }`}
                >
                  <Link
                    to={`/home/${tab}`}
                    className="flex justify-between items-center w-full group"
                  >
                    {tab}
                    {location.pathname.endsWith(tab) && (
                      <Circle fill="#334155" className={"h-5 w-5"} />
                    )}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
