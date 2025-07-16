import { Navigation } from "@/components/navigation"
import RippleGrid from "@/components/RippleGrid/RippleGrid"
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
import { motion } from "framer-motion"
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

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="absolute top-0 left-0 z-[-1]">
        <div className="relative h-screen w-screen overflow-hidden bg-black">
          <RippleGrid
            enableRainbow={false}
            gridColor="#6600ff"
            rippleIntensity={0.05}
            gridSize={20}
            gridThickness={15}
            glowIntensity={1}
            mouseInteraction={false}
            mouseInteractionRadius={1.2}
            opacity={0.8}
          />
        </div>
      </div>

      <motion.section
        className="border-b min-h-screen flex justify-center items-center bg-transparent"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="container mx-auto grid gap-5 justify-items-center max-w-[80%]"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
            },
          }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 text-center grid"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <span className="whitespace-nowrap text-white/80">
              Built For Bloggers And
            </span>{" "}
            <span className="text-white/80">Loved By Thinkers.</span>
          </motion.h1>

          <motion.div
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5 } },
            }}
          >
            <Button size="lg" variant="outline" asChild>
              <Link to={"/register"}>Get Started For Free</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to={"/about"}>About Us</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Blog Posts Section */}
      <section className="container mx-auto px-4 pt-12">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        ></motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
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
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
