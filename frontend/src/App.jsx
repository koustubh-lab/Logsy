import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import BarsLoader from "./components/BarLoader"
import EditPostPage from "./pages/EditPage"
import HomeLayout from "./pages/HomeLayout"
import ProtectedRoute from "./pages/ProtectedRoute"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
// const HomeLayout = lazy(() => import("./pages/HomeLayout"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const ExplorePage = lazy(() => import("./pages/ExplorePage"))
const CreatePostPage = lazy(() => import("./pages/CreatePostPage"))
const BlogPostPage = lazy(() => import("./pages/PostPage"))
const InvalidRoutePage = lazy(() => import("./pages/InvalidRoutePage"))

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
        { path: "create-post", element: <CreatePostPage /> },
        { path: "edit/:id", element: <EditPostPage /> },
      ],
    },
    {
      path: "/post/:id",
      element: <BlogPostPage />,
    },
    {
      path: "/home/edit/:id",
      element: <EditPostPage />,
    },
    {
      path: "*",
      element: <InvalidRoutePage />,
    },
  ])
  return (
    <Suspense fallback={<BarsLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
