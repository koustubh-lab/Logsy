import { Navigation } from "@/components/navigation"
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
import { CalendarDays, User } from "lucide-react"
import { Link } from "react-router-dom"

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    author: "John Doe",
    date: "2024-01-15",
    excerpt:
      "Learn how to set up a modern React application with TypeScript for better development experience and type safety.",
    tags: ["React", "TypeScript", "Web Development"],
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Building Responsive Layouts with Tailwind CSS",
    author: "Jane Smith",
    date: "2024-01-12",
    excerpt:
      "Discover the power of utility-first CSS framework and how to create beautiful, responsive designs efficiently.",
    tags: ["CSS", "Tailwind", "Design"],
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "State Management in Modern React Applications",
    author: "Mike Johnson",
    date: "2024-01-10",
    excerpt:
      "Explore different state management solutions and learn when to use each approach in your React applications.",
    tags: ["React", "State Management", "Redux"],
    readTime: "12 min read",
  },
  {
    id: 4,
    title: "API Integration Best Practices",
    author: "Sarah Wilson",
    date: "2024-01-08",
    excerpt:
      "Learn how to effectively integrate APIs in your frontend applications with proper error handling and caching.",
    tags: ["API", "JavaScript", "Best Practices"],
    readTime: "10 min read",
  },
  {
    id: 5,
    title: "Performance Optimization Techniques",
    author: "David Brown",
    date: "2024-01-05",
    excerpt:
      "Discover various techniques to optimize your web application's performance and improve user experience.",
    tags: ["Performance", "Optimization", "Web Development"],
    readTime: "15 min read",
  },
  {
    id: 6,
    title: "Testing React Components Effectively",
    author: "Emily Davis",
    date: "2024-01-03",
    excerpt:
      "Master the art of testing React components with modern testing libraries and best practices.",
    tags: ["Testing", "React", "Jest"],
    readTime: "7 min read",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 via-slate-200 to-white">
        <div className="container mx-auto grid justify-items-center max-w-[80%]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-4 text-center grid">
            <span className="whitespace-nowrap">Built For Bloggers And </span>{" "}
            <span>Loved By Thinkers.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-8 max-w-4xl text-center">
            Discover the latest insights, tutorials, and best practices in web
            development. Join our community of developers and stay ahead of the
            curve.
          </p>
          <div className="flex gap-3">
            <Button size="lg">
              <Link to={"/register"}>Get Started For Free</Link>
            </Button>
            <Button size="lg" variant={"outline"}>
              <Link to={"/about"}>About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="container mx-auto px-4 pt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                  <CalendarDays className="h-4 w-4 ml-2" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{post.readTime}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link to={`/post/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center gap-4">
          <Button variant="outline">Previous</Button>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">
              10
            </Button>
          </div>
          <Button variant="outline">Next</Button>
        </div> */}
      </section>
    </div>
  )
}
