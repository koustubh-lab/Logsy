import { getPostsForUserByPageWithDashboardDetailsApi } from "@/api/PostApiService"
import useAuth from "@/context/AuthContext"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarDays, Edit, Eye, MessageSquare, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export default function ViewAllPostDialog({ deletePost }) {
  const [data, setData] = useState({ posts: [], totalPosts: 0 })
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { token } = useAuth()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (token) {
      setData({ posts: [], totalPosts: 0 })
      setPage(0)
      setHasMore(true)
    }
  }, [token])

  useEffect(() => {
    getPostsForUserByPage()
  }, [page, token])

  async function getPostsForUserByPage() {
    if (!token || !hasMore || isLoading) return
    setIsLoading(true)

    try {
      const response = await getPostsForUserByPageWithDashboardDetailsApi(
        page,
        5
      )
      if (response.status !== 200) throw new Error(response)

      const { data: responseData } = response
      setData((prev) => ({
        posts: [...prev.posts, ...responseData.posts],
        totalPosts: responseData.totalPosts,
      }))
      if (responseData.posts.length < 3) setHasMore(false)
    } catch (error) {
      toast.error("Failed to load posts.")
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasMore &&
      !isLoading
    ) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All</Button>
      </DialogTrigger>
      <DialogContent className="sm:top-[50%] sm:translate-y-[-50%] w-[800px] max-w-full h-screen sm:h-[70vh] flex flex-col">
        <DialogHeader className={"h-fit"}>
          <DialogTitle>View All Posts</DialogTitle>
          <DialogDescription>Scroll to load more posts</DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 flex flex-col pr-2 thin-stylish-scrollbar"
        >
          <div className="flex-1 grid gap-3 auto-rows-min">
            {data?.posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="flex flex-col md:flex-row gap-5 items-start justify-between max-w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2 overflow-hidden">
                    <h3 className="font-semibold text-base sm:text-lg max-w-full text-ellipsis line-clamp-2 sm:line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {format(new Date(post.createdAt), "dd MMMM yyyy")}
                    </div>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this post? This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex justify-end gap-2 pt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            deletePost(post.id)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}

            {data?.posts.length === 0 && (
              <div className="text-center text-sm py-4 text-gray-500 bg-muted/40 grid place-content-center rounded-lg sm:text-2xl">
                No posts found.
              </div>
            )}

            {isLoading && (
              <div className="text-center text-sm py-4 text-gray-500">
                Loading more posts...
              </div>
            )}
            {!hasMore && !isLoading && data.posts.length > 0 && (
              <div className="text-center text-sm py-1 text-muted-foreground bg-foreground/10 rounded-full">
                No more posts to load.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
