import { useEffect } from "react"
import BarsLoader from "./BarLoader"

export default function FullSizeLoader() {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])
  return (
    <div className="absolute top-0 left-0 w-screen z-[100] h-screen flex items-center justify-center bg-background/50 backdrop-blur-md pointer-events-none">
      <BarsLoader />
    </div>
  )
}
