import {
  commentByUserApi,
  deleteCommentByUserApi,
} from "@/api/CommentApiService"
import { likePostByUserApi, unlikePostByUserApi } from "@/api/LikeApiService"
import { getPostByIdApi, getPostByIdForGuest } from "@/api/PostApiService"
import BarsLoader from "@/components/BarLoader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import useAuth from "@/context/AuthContext"
import { getErrorMessage } from "@/utils/AxoisErrorHandler"
import { format, isValid, parseISO } from "date-fns"
import { motion } from "framer-motion"
import { debounce } from "lodash"
import {
  CalendarDays,
  Clock,
  Copy,
  ExternalLink,
  Heart,
  MessageSquare,
  MoreHorizontal,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function BlogPostPage() {
  const { id } = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPostLiked, setIsPostLiked] = useState(false)
  const navigate = useNavigate()

  const [comment, setComment] = useState("")
  const [tags, setTags] = useState([])
  const [profile, setProfile] = useState(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  const handlePostLike = debounce(async () => {
    if (isAuthenticated) {
      const functionToCall = isPostLiked
        ? unlikePostByUserApi
        : likePostByUserApi
      try {
        const response = await functionToCall(post.id)
        const { status } = response
        if (status === 200) {
          const liked = !isPostLiked
          setIsPostLiked(liked)
          toast.message(
            liked
              ? "I see, you like the article 😘"
              : "I will try to improve the quality of article 😭"
          )
        }
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    } else {
      toast.warning("Sign In Required", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      })
    }
  }, 200)

  async function getPostById() {
    if (authLoading) return

    const functionToCall = isAuthenticated
      ? getPostByIdApi
      : getPostByIdForGuest

    try {
      const response = await functionToCall(id)
      const { status, data } = response
      if (status === 200) {
        const { post: postData, profile: profileData } = data
        setPost(postData)
        setIsPostLiked(postData?.isLiked)
        setTags(postData?.tags)
        setProfile(profileData)
      }
      setIsLoading(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCommentByUser() {
    if (isAuthenticated) {
      if (comment === "") {
        toast.warning("Comment cannot be empty")
        return
      }

      try {
        const { status } = await commentByUserApi(comment, post.id)
        if (status === 200) {
          await getPostById()
          toast.success("Comment added")

          setComment("")
        }
        setComment("")
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    } else {
      toast.warning("Sign In Required", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      })
    }
  }

  function handleCommentEdit(e) {
    e.preventDefault()
    toast.info("button clicked")
  }

  async function handleDeleteComment(commentId) {
    if (isAuthenticated) {
      if (commentId === null && post.id === null) {
        toast.error("Could not perform the operation")
        return
      }

      try {
        const { status } = await deleteCommentByUserApi(commentId, post.id)
        if (status === 200) {
          toast.info("Comment Deleted!!!")
          setPost((prev) => ({
            ...prev,
            commentList: prev.commentList.filter(
              (comment) => comment.id !== commentId
            ),
          }))
        }
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    } else {
      toast.warning("Unauthorized Action")
    }
  }

  useEffect(() => {
    getPostById()
  }, [isAuthenticated])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto sm:px-4 sm:py-8">
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
              <Card className="mb-8 rounded-none sm:rounded-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex gap-2 items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-fit text-gray-500 align-middle"
                          >
                            <User className="h-4 w-4" />
                            {profile?.username}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[800px] max-w-full">
                          <DialogHeader>
                            <DialogTitle>Author's Profile</DialogTitle>
                            <DialogDescription>
                              You can use this information to contact the author
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 border p-3 rounded-md">
                              <Avatar className="w-10 h-10 md:w-14 md:h-14 border border-foreground/20 overflow-hidden rounded-full">
                                <AvatarImage
                                  src={
                                    profile?.profilePicture
                                      ? `${profile.profilePicture}`
                                      : "/placeholder.svg?height=128&width=128"
                                  }
                                  alt="User Avatar"
                                  className="object-cover w-full h-full"
                                />
                                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                                  {profile?.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <h3 className="text-lg font-semibold">
                                  {profile?.username}
                                </h3>
                                <p className="text-sm text-muted-foreground flex gap-2 items-center">
                                  {profile?.email}
                                  <Copy
                                    className="w-4 h-4 cursor-pointer focus:outline-none"
                                    tabIndex={0}
                                    role="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        profile?.email
                                      )
                                      toast.success("Copied to clipboard")
                                    }}
                                  />
                                </p>
                              </div>
                            </div>

                            {profile?.professions && (
                              <div>
                                <h3>Professions</h3>
                                <p className="text-muted-foreground">
                                  {profile?.professions?.join(", ")}
                                </p>
                              </div>
                            )}

                            {profile?.bio && (
                              <div>
                                <h3>Bio</h3>
                                <p className="text-muted-foreground">
                                  {profile?.bio}
                                </p>
                              </div>
                            )}

                            {!profile?.github &&
                            !profile?.twitter &&
                            !profile?.linkedin ? (
                              ""
                            ) : (
                              <div className="w-full grid gap-2">
                                <h3 className="text-sm font-semibold">
                                  Social Media Links
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {profile?.github && (
                                    <a
                                      href={profile?.github}
                                      target="_blank"
                                      className="w-full"
                                    >
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-full"
                                      >
                                        Github <ExternalLink />
                                      </Button>
                                    </a>
                                  )}
                                  {profile?.twitter && (
                                    <a
                                      href={profile?.twitter}
                                      target="_blank"
                                      className="w-full"
                                    >
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-full"
                                      >
                                        Twitter <ExternalLink />
                                      </Button>
                                    </a>
                                  )}
                                  {profile?.linkedin && (
                                    <a
                                      href={profile?.linkedin}
                                      target="_blank"
                                      className="w-full"
                                    >
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-full"
                                      >
                                        Linkedin <ExternalLink />
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <CalendarDays className="h-4 w-4 ml-2" />
                      <span>
                        {post?.createdAt &&
                          format(parseISO(post.createdAt), "M/d/yyyy")}
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
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl mb-2 font-bold underline underline-offset-2 pb-4">
                    {post.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-sm text-muted-foreground hover:bg-muted"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Separator />
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`prose prose-md max-w-none dark:prose-invert`}
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
              <Card className="rounded-none sm:rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8 p-4 pt-0 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      Add a Comment
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          id="comment"
                          placeholder="Share your thoughts..."
                          rows={4}
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}
                        />
                      </div>
                      <Button onClick={handleCommentByUser}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {post?.commentList?.map((comment, idx) => (
                      <div key={idx}>
                        <motion.div
                          key={comment.id}
                          className="border-l-4 border-blue-400 pl-4 p-2 rounded-md rounded-br-none bg-muted/50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                        >
                          <div
                            className={`flex items-center justify-between gap-1 text-sm text-gray-500 mb-2 text-primary/80`}
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
                                    <DropdownMenuItem
                                      className="text-red-400 hover:bg-red-200 cursor-pointer"
                                      onSelect={() => {
                                        handleDeleteComment(comment?.id)
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 text-primary">
                            {comment.content}
                          </p>
                        </motion.div>
                        <div className="flex justify-end text-[12px] text-muted-foreground items-center">
                          <div className="flex text-[12px] text-muted-foreground p-1 px-3 gap-2 items-center rounded-bl-md rounded-br-md bg-muted/50">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {comment?.createAt &&
                              isValid(parseISO(comment.createAt))
                                ? format(
                                    parseISO(comment.createAt),
                                    "dd MMMM yyyy"
                                  )
                                : "Invalid date"}
                            </span>
                            <Clock className="h-4 w-4" />
                            <span>
                              {comment?.createAt &&
                              isValid(parseISO(comment.createAt))
                                ? format(parseISO(comment.createAt), "hh:mm a")
                                : "--:--"}
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
          <BarsLoader />
        )}
      </div>
    </div>
  )
}
