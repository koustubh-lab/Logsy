import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function Navigation() {
  return (
    <nav className="absolute top-0 bg-white/10 backdrop-blur-md w-full">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16 px-10">
          <Link to="/" className="text-2xl text-gray-900 font-semibold">
            <h2>Logsy</h2>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/register">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
