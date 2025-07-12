import { commentByUserApi } from "@/api/CommentApiService"
import { getPostByIdApi } from "@/api/PostApiService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import useAuth from "@/context/AuthContext"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { debounce } from "lodash"
import {
  CalendarDays,
  Clock,
  Heart,
  MessageSquare,
  MoreHorizontal,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const blogPost = {
  id: 1,
  title: "Getting Started with React and TypeScript",
  author: "John Doe",
  date: "2024-01-15",
  content: `
    <h2>Introduction</h2>
    <p>React and TypeScript make a powerful combination for building modern web applications. TypeScript adds static type checking to JavaScript, which helps catch errors early and provides better developer experience with improved IDE support.</p>

    <h2>Setting Up Your Project</h2>
    <p>To get started with React and TypeScript, you can use Create React App with the TypeScript template:</p>

    <pre><code>npx create-react-app my-app --template typescript</code></pre>

    <p>This command creates a new React application with TypeScript configuration already set up for you.</p>

    <h2>Basic TypeScript Concepts</h2>
    <p>Here are some fundamental TypeScript concepts you'll need to understand:</p>

    <ul>
      <li><strong>Types:</strong> Define the shape of your data</li>
      <li><strong>Interfaces:</strong> Define contracts for objects</li>
      <li><strong>Generics:</strong> Create reusable components</li>
      <li><strong>Union Types:</strong> Allow multiple types for a single variable</li>
    </ul>

    <h2>React Components with TypeScript</h2>
    <p>When creating React components with TypeScript, you'll want to define prop types using interfaces:</p>

    <pre><code>interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={variant} onClick={onClick}>
      {children}
    </button>
  );
};</code></pre>

    <h2>Conclusion</h2>
    <p>React and TypeScript together provide a robust foundation for building scalable web applications. The type safety and developer experience improvements make it worth the initial learning curve.</p>
  `,
  tags: ["React", "TypeScript", "Web Development"],
  readTime: "5 min read",
}

const comments = [
  {
    id: 1,
    author: "Alice Johnson",
    date: "2024-01-16",
    content:
      "Great article! This really helped me understand how to get started with TypeScript in React projects.",
  },
  {
    id: 2,
    author: "Bob Smith",
    date: "2024-01-17",
    content:
      "Thanks for the detailed explanation. The code examples are very helpful.",
  },
  {
    id: 3,
    author: "Carol Davis",
    date: "2024-01-18",
    content:
      "I've been hesitant to try TypeScript, but this article convinced me to give it a shot!",
  },
]

export default function BlogPostPage() {
  const { id } = useParams()
  const { token } = useAuth()

  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPostLiked, setIsPostLiked] = useState(false)
  const [comment, setComment] = useState("")

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  const { isAuthenticated } = useAuth()

  const handlePostLike = debounce(() => {
    setIsPostLiked(!isPostLiked)
    toast.message(
      isPostLiked
        ? "I will try to improve the quality of article 😒"
        : "I see, you like the article 😘"
    )
  }, 300)

  async function getPostById() {
    if (token) {
      try {
        const response = await getPostByIdApi(id)
        const { status, data } = response
        if (status === 200) {
          console.log(data)
          setPost(data)
          setIsPostLiked(data?.isLiked)
        }
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function handleCommentByUser() {
    if (comment === "") {
      toast.warning("Comment cannot be empty")
      return
    }

    if (isAuthenticated) {
      try {
        const { status } = await commentByUserApi(comment, post.id)
        if (status === 200) {
          toast.success("Comment added")
          setComment("")
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.warning("Login to comment")
    }
  }

  function handleCommentEdit(e) {
    e.preventDefault()
    toast.info("button clicked")
  }

  useEffect(() => {
    getPostById()
  }, [token])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {!isLoading ? (
          <motion.article
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex gap-2 items-center">
                      <User className="h-4 w-4" />
                      <span>{post?.author}</span>
                      <CalendarDays className="h-4 w-4 ml-2" />
                      <span>
                        {format(new Date(post?.createdAt), "dd MMMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePostLike}
                      >
                        {!isMobile
                          ? isPostLiked
                            ? "Liked"
                            : "Like the post"
                          : ""}
                        <Heart
                          className="h-5 w-5"
                          fill={isPostLiked ? "#db2777" : "none"} // pink-600
                          stroke={isPostLiked ? "#db2777" : "currentColor"}
                        />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl mb-4 font-bold underline underline-offset-2 pb-4 border-b">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="prose prose-md max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    dangerouslySetInnerHTML={{
                      __html: post.content?.replaceAll("<br>", ""),
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments &lt;{post.commentList.length}&gt;
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Add a Comment
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          id="comment"
                          placeholder="Share your thoughts..."
                          rows={4}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleCommentByUser}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {post?.commentList?.map((comment) => (
                      <div>
                        <div
                          key={comment.id}
                          className="border-l-4 border-blue-200 pl-4 p-2 bg-slate-50 rounded-md border"
                        >
                          <div
                            className={`flex items-center justify-between gap-1 text-sm text-gray-500 mb-2`}
                          >
                            <div
                              className={`flex items-center gap-${
                                isMobile ? "2" : "1"
                              } text-sm overflow-hidden`}
                            >
                              <User className="h-4 w-4" />
                              <span className="font-medium">
                                {comment.author}
                              </span>
                            </div>
                            {comment.isEditable && (
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="p-1 h-fit"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      disabled
                                      onSelect={handleCommentEdit}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-400 hover:text-red-400 hover:bg-red-200">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex justify-end text-[12px] text-muted-foreground items-center">
                          <div className="flex text-[12px] text-muted-foreground p-1 gap-2 items-center border border-t-0 bg-slate-50 rounded-bl-md rounded-br-md">
                            <CalendarDays className="h-4 w-4 ml-2" />
                            <span>
                              {format(
                                new Date(comment?.createAt),
                                "dd MMMM yyyy"
                              )}
                            </span>
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(comment?.createAt), "hh:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.article>
        ) : (
          <div>Is loading</div>
        )}
      </div>
    </div>
  )
}
