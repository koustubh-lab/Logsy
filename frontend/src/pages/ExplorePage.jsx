import { getPostsForUserByPageApi } from "@/api/PostApiService"
import { BlogPostCard } from "@/components/BlogPostCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

export default function ExplorePage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [searchContent, setSearchContent] = useState("")
  const scrollRef = useRef(null)
  const PAGE_NUMBER = 0

  async function getPostByPage() {
    try {
      const response = await getPostsForUserByPageApi(PAGE_NUMBER, 10)
      const { status, data } = response
      if (status === 200) setBlogPosts(data)
    } catch (error) {
      console.log(error)
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

  function handleTagSelect(selectedOption) {
    setSearchContent(selectedOption)
  }

  useEffect(() => {
    getPostByPage()
  }, [])

  return (
    <main className="container mx-auto max-h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white p-2 px-5 pt-8 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
          <h1 className="text-3xl font-semibold md:text-4xl text-center md:text-left">
            Explore Blog Posts
          </h1>
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts by title or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-md"
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-hidden px-2 sm:px-0">
          <Button
            className="shadow rounded-lg flex-shrink-0"
            onClick={() => scrollTags("left")}
          >
            <ChevronLeft size={20} />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto max-w-full scrollbar-hide"
          >
            {options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="px-4 py-1 text-sm rounded-full whitespace-nowrap"
                onClick={() => handleTagSelect(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <Button
            className="shadow rounded-lg flex-shrink-0"
            onClick={() => scrollTags("right")}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="grid h-[75vh] overflow-auto gap-8 p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min">
        {blogPosts.map((post, idx) => (
          <BlogPostCard key={idx} {...post} />
        ))}
      </div>
    </main>
  )
}
