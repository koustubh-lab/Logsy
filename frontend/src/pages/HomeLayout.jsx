import SideSheet from "@/components/SideSheet"
import { Outlet } from "react-router-dom"

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Optional: Sidebar or Navigation */}
      <SideSheet />

      {/* Main content changes based on child route */}
      <div className="flex-1 max-w-full">
        <Outlet />
      </div>
    </div>
  )
}
