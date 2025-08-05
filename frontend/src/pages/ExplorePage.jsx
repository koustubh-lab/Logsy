import {
  getAllPostsForUserByPageApi,
  searchPostByText,
} from "@/api/PostApiService"
import { BlogPostCard } from "@/components/BlogPostCard"
import { BlogPostCardPlaceholder } from "@/components/BlogPostCardPlaceholder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getErrorMessage } from "@/utils/AxoisErrorHandler"
import { motion } from "framer-motion"
import { ChevronsLeft, ChevronsRight, Search, SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const options = [
  { label: "JavaScript", value: "javascript" },
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "nodejs" },
  { label: "Express", value: "express" },
  { label: "MongoDB", value: "mongodb" },
  { label: "SQL", value: "sql" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Java", value: "java" },
  { label: "Spring Boot", value: "springboot" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Tailwind CSS", value: "tailwind" },
  { label: "Bootstrap", value: "bootstrap" },
  { label: "Web Development", value: "webdev" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Full Stack", value: "fullstack" },
  { label: "DevOps", value: "devops" },
  { label: "Git", value: "git" },
  { label: "GitHub", value: "github" },
  { label: "Linux", value: "linux" },
  { label: "Testing", value: "testing" },
  { label: "VS Code", value: "vscode" },
  { label: "Tips & Tricks", value: "tips" },
  { label: "Career", value: "career" },
]

const POST_TO_LOAD = 9

export default function ExplorePage() {
  const { topic } = useParams()
  const [blogPosts, setBlogPosts] = useState([])
  const [searchContent, setSearchContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [hideHeader, setHideHeader] = useState(false)
  const gridScrollRef = useRef(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const [pageNumber, setPageNumber] = useState(0)
  const [isEndReached, setIsEndReached] = useState(false)

  const handleScroll = () => {
    const scrollTop = gridScrollRef.current?.scrollTop || 0
    setHideHeader(scrollTop > 0)
  }

  async function getPostByPage() {
    try {
      const response = await getAllPostsForUserByPageApi(
        pageNumber,
        POST_TO_LOAD
      )
      const { status, data } = response
      if (status === 200) {
        if (blogPosts.length > 0) {
          setBlogPosts([...blogPosts, ...data])
          if (data.length < POST_TO_LOAD) setIsEndReached(true)
        } else {
          setBlogPosts(data)
        }
        setPageNumber((prev) => prev + 1)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  function scrollTags(direction) {
    const scrollAmount = 450
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  async function handleContentSearch() {
    if (!searchContent) return
    setLoading(true)

    if (searchContent !== topic) {
      navigate(`/home/explore/${encodeURIComponent(searchContent)}`)
    }

    try {
      const response = await searchPostByText(searchContent)
      const { data, status } = response
      if (status === 200) {
        setBlogPosts(data)
        setPageNumber(1)
        setSearchContent("")
        setIsEndReached(data.length < POST_TO_LOAD)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  function handleTagSelect(selectedOption) {
    setSearchContent(selectedOption)
    navigate(`/home/explore/${encodeURIComponent(selectedOption)}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (topic) {
        try {
          const response = await searchPostByText(topic)
          const { data, status } = response
          if (status === 200) {
            setBlogPosts(data)
            setPageNumber(1)
            setIsEndReached(data.length < POST_TO_LOAD)
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      } else {
        setBlogPosts([])
        setPageNumber(0)
        await getPostByPage()
      }
    }

    fetchData()
  }, [topic, location.pathname])

  return (
    <main className="container mx-auto h-screen flex flex-col">
      <motion.div
        className="sticky top-0 z-10 p-2 px-5 pt-4 sm:pt-5 shadow-sm bg-background"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center justify-between gap-4 md:flex-row mb-4 sm:mb-4 overflow-hidden"
          variants={{
            expanded: { height: "auto", opacity: 1 },
            collapsed: { height: 0, opacity: 0, marginBottom: 0 },
          }}
          animate={hideHeader ? "collapsed" : "expanded"}
          initial="expanded"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-3xl text-center md:text-left">
            Explore Posts
          </h1>
          <div className="flex gap-3 w-full max-w-md">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts by title or keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-md"
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContentSearch()}
              />
            </div>
            <Button onClick={handleContentSearch}>
              <Search />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center px-2 sm:px-0 gap-2 py-1 w-full mx-auto max-w-[100vw]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            className="shrink-0 shadow rounded-lg hidden sm:block"
            onClick={() => scrollTags("left")}
          >
            <ChevronsLeft size={20} />
          </Button>

          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide"
            >
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.5, x: -300 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="px-4 py-1 text-sm rounded-full whitespace-nowrap"
                    onClick={() => handleTagSelect(option.value)}
                  >
                    {option.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <Button
            className="shrink-0 shadow rounded-lg hidden sm:block"
            onClick={() => scrollTags("right")}
          >
            <ChevronsRight size={20} />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        ref={gridScrollRef}
        onScroll={handleScroll}
      >
        <motion.div
          className="grid overflow-auto gap-8 p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 1.8,
              },
            },
          }}
        >
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BlogPostCardPlaceholder />
              </motion.div>
            ))
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BlogPostCard {...post} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid place-content-center h-40 rounded-md bg-muted/50">
              No Posts
            </div>
          )}

          {blogPosts.length > 0 &&
            (isEndReached ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center">
                <Separator className="flex-1" />
                <p className="text-muted-foreground px-3 text-sm">The End</p>
                <Separator className="flex-1" />
              </div>
            ) : (
              <Button
                variant="outline"
                className="col-span-1 sm:col-span-2 lg:col-span-3"
                onClick={() =>
                  topic ? handleContentSearch() : getPostByPage()
                }
              >
                Load More Posts
              </Button>
            ))}
        </motion.div>
      </motion.div>
    </main>
  )
}
