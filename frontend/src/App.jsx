import { lazy, Suspense, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import BarsLoader from "./components/BarLoader"
import EditPostPage from "./pages/EditPage"
import PrivacyPage from "./pages/PrivacyPolicyPage"
import ProtectedRoute from "./pages/ProtectedRoute"
import ValidateActivationTokenPage from "./pages/ValidateActivationTokenPage"
import { applyThemeBasedOnTime } from "./utils/ThemeUtils"
import TermsOfServicePage from "./pages/TermsOfServicePage"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const HomeLayout = lazy(() => import("./pages/HomeLayout"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const ExplorePage = lazy(() => import("./pages/ExplorePage"))
const CreatePostPage = lazy(() => import("./pages/CreatePostPage"))
const BlogPostPage = lazy(() => import("./pages/PostPage"))
const InvalidRoutePage = lazy(() => import("./pages/InvalidRoutePage"))
const ValidateLoginTokenPage = lazy(() =>
  import("./pages/ValidateLoginTokenPage")
)

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/validate-login-token",
      element: <ValidateLoginTokenPage />,
    },
    {
      path: "/activate-account",
      element: <ValidateActivationTokenPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomeLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "explore", element: <ExplorePage /> },
        { path: "explore/:topic", element: <ExplorePage /> },
        { path: "create-post", element: <CreatePostPage /> },
        { path: "edit/:id", element: <EditPostPage /> },
      ],
    },
    {
      path: "/post/:id",
      element: <BlogPostPage />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPage />,
    },
    {
      path: "/terms-and-conditions",
      element: <TermsOfServicePage />,
    },
    {
      path: "*",
      element: <InvalidRoutePage />,
    },
  ])

  useEffect(() => {
    applyThemeBasedOnTime()
    const interval = setInterval(applyThemeBasedOnTime, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Suspense fallback={<BarsLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
