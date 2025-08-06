import { useEffect } from "react"
import BarsLoader from "./BarLoader"

export default function FullSizeLoader() {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [])
  return (
    <div className="fixed top-0 left-0 w-screen z-[100] h-screen flex items-center justify-center bg-background/50 backdrop-blur-md pointer-events-none">
      <BarsLoader />
    </div>
  )
}
