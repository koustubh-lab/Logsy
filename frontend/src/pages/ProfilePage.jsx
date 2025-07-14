import { BlogPostCard } from "@/components/BlogPostCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { PencilIcon } from "lucide-react"

export default function ProfilePage() {
  const userPosts = [
    {
      title: "Getting Started with Next.js 15",
      description:
        "A comprehensive guide to building modern web applications with the latest Next.js features.",
      author: "John Doe",
      createdAt: "July 10, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "nextjs-15-guide",
    },
    {
      title: "Understanding Server Components in React",
      description:
        "Dive deep into the world of React Server Components and how they change data fetching.",
      author: "John Doe",
      createdAt: "June 28, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "react-server-components",
    },
    {
      title: "Building a Scalable API with Node.js and Express",
      description:
        "Learn best practices for creating robust and scalable APIs using Node.js and Express.",
      author: "John Doe",
      createdAt: "June 15, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "nodejs-express-api",
    },
  ]

  const likedPosts = [
    {
      title: "The Future of Web Development: AI and Beyond",
      description:
        "Exploring how artificial intelligence is shaping the landscape of web development.",
      author: "Jane Smith",
      createdAt: "July 5, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "ai-web-dev-future",
    },
    {
      title: "CSS-in-JS vs. Tailwind CSS: A Head-to-Head Comparison",
      description:
        "Which styling approach is right for your next project? A detailed comparison.",
      author: "Alex Johnson",
      createdAt: "May 20, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "css-in-js-vs-tailwind",
    },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.main
      className="container mx-auto py-8 px-4 md:px-6 lg:px-8"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <motion.div
        className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
        variants={fadeInUp}
      >
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary">
          <AvatarImage
            src="/placeholder.svg?height=128&width=128"
            alt="User Avatar"
          />
          <AvatarFallback className="text-4xl">JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl md:text-4xl font-bold">John Doe</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PencilIcon className="w-5 h-5" />
              <span className="sr-only">Edit Profile</span>
            </Button>
          </div>
          <p className="text-lg text-muted-foreground mt-1">
            Blogger | Tech Enthusiast
          </p>
          <p className="mt-4 max-w-2xl text-muted-foreground text-base">
            Passionate about web development, AI, and open-source projects.
            Sharing insights and tutorials on the latest tech trends.
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="posts" className="mt-12 w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto md:mx-0">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="liked">Liked Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-8">
          <motion.h2 className="text-2xl font-bold mb-6" variants={fadeInUp}>
            My Blog Posts
          </motion.h2>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={fadeInUp}
          >
            {userPosts.map((post) => (
              <BlogPostCard key={post.slug} {...post} />
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="liked" className="mt-8">
          <motion.h2 className="text-2xl font-bold mb-6" variants={fadeInUp}>
            Liked Blog Posts
          </motion.h2>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={fadeInUp}
          >
            {likedPosts.map((post) => (
              <BlogPostCard key={post.slug} {...post} />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.main>
  )
}
