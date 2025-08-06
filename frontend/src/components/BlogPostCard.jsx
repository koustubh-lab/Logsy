import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BlogPostPage from "@/pages/PostPage"
import { CalendarDays, User } from "lucide-react"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"

export function BlogPostCard({
  title,
  description,
  author,
  createdAt,
  id,
  tags = [],
}) {
  const scrollRefs = useRef({})
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    const target = e.currentTarget
    startX.current = e.pageX - target.offsetLeft
    scrollLeft.current = target.scrollLeft
    target.style.cursor = "grabbing"
  }

  const handleMouseLeave = (e) => {
    setIsDragging(false)
    e.currentTarget.style.cursor = "grab"
  }

  const handleMouseUp = (e) => {
    setIsDragging(false)
    e.currentTarget.style.cursor = "grab"
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const target = e.currentTarget
    const x = e.pageX - target.offsetLeft
    const walk = (x - startX.current) * 2
    target.scrollLeft = scrollLeft.current - walk
  }

  return (
    <div className="w-full h-full">
      <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300 max-w-full h-full">
        <CardHeader className="flex-1 pb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <User className="h-4 w-4" />
            <span>{author}</span>
            <CalendarDays className="h-4 w-4 ml-2" />
            <span>{BlogPostPage}</span>
          </div>
          <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors leading-normal">
            <Link to={`/post/${id}`}>{title}</Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            <div
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            ></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex gap-2 mb-0 whitespace-nowrap overflow-auto cursor-grab unscrollable"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={(el) => (scrollRefs.current[id] = el)}
          >
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs pointer-events-none select-none"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full" asChild>
            <Link to={`/post/${id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
