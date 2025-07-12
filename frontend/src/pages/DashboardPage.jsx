import { getPostsForUserByPageApi } from "@/api/PostApiService"
import BarsLoader from "@/components/BarLoader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useAuth from "@/context/AuthContext"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarDays, Edit, Eye, MessageSquare, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function DashboardPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const { token } = useAuth()

  const boxRef = useRef(null)
  const [isToggled, setIsToggled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const timelineRef = useRef()

  /* const handleMaximizeClick = () => {
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({ paused: true }).to(boxRef.current, {
        duration: 0.5,
        backgroundColor: "#ffe8d6",
        borderRadius: "16px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        ease: "power2.inOut",
      })
    }

    if (!isToggled) {
      timelineRef.current.play()
    } else {
      timelineRef.current.reverse()
    }

    setIsToggled(!isToggled)
  } */

  async function getPostsForUserByPage() {
    if (token) {
      try {
        const response = await getPostsForUserByPageApi(page)
        if (response.status !== 200) throw new Error(response)

        const { data } = response
        setTimeout(() => {
          console.log(data)
          setPosts(data)
          setIsLoading(false)
        }, 0)
      } catch (error) {
        if (error.response) {
          toast.error(
            `Error ${error.response.status}: ${error.response.statusText}`
          )
          console.log(error)
        } else if (error.request) {
          toast.error("Ensure that you have a stable internet connection")
        } else {
          toast.error("Server error")
        }
      }
    }
  }

  useEffect(() => {
    getPostsForUserByPage()
  }, [token])

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 py-5">
        {/* <motion.div
          className="pb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div>
            <Input
              className="max-w-3xl mx-auto shadow-md"
              placeholder="Search blogs"
            />
          </div>
        </motion.div> */}

        <motion.div
          className="flex flex-wrap gap-5 sm:gap-10 items-center justify-between mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your blog posts and content
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/home/create-post">
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                New Post
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.6,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {"0 0 0 0".split(" ").map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
            >
              <Card>
                <CardHeader className="p-2 px-4">
                  <CardDescription>
                    {
                      ["Total Posts", "Total Likes", "Total Views", "Comments"][
                        idx
                      ]
                    }
                  </CardDescription>
                  <CardTitle className="text-xl">{value}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Card ref={boxRef}>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Manage and edit your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-8">
                    <BarsLoader />
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      className="flex flex-col md:flex-row gap-5 items-start justify-between max-w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2 overflow-hidden">
                          <h3 className="font-semibold text-base sm:text-lg max-w-full text-ellipsis line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {format(new Date(post.createdAt), "dd MMMM yyyy")}
                          </div>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />{" "}
                            {post.commentList.length} comments
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 h-full">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/post/${post.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/home/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    No posts were found
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-3">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
