import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import App from "./App.jsx"
import { AuthContextProvider } from "./context/AuthContext.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
    <Toaster />
  </AuthContextProvider>
)
