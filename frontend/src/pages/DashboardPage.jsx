import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { CalendarDays, Edit, Eye, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

const userPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    status: "published",
    date: "2024-01-15",
    views: 1250,
    comments: 8,
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    status: "draft",
    date: "2024-01-20",
    views: 0,
    comments: 0,
  },
  {
    id: 3,
    title: "Building Scalable Applications",
    status: "published",
    date: "2024-01-18",
    views: 890,
    comments: 5,
  },
]

export default function DashboardPage() {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 pt-2 pb-8">
        <motion.div
          className="bg-white/50 pb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Input
            className="max-w-3xl mx-auto border-muted-foreground"
            placeholder="Search blogs"
          />
        </motion.div>

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
          <Button asChild>
            <Link to="/dashboard/new-post">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
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
          {["12", "8", "5.2K", "47"].map((value, idx) => (
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
                      ["Total Posts", "Published", "Total Views", "Comments"][
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Manage and edit your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="flex flex-col sm:flex-row gap-5 items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 overflow-hidden max-w-[80%]">
                        <h3 className="font-semibold text-base sm:text-lg truncate">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views} views
                        </div>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 h-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/post/${post.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/edit/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
