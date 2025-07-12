import { BlogPostCard } from "@/components/BlogPostCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export default function ExplorePage() {
  const blogPosts = [
    {
      title: "The Rise of AI in Content Creation",
      description:
        "How artificial intelligence is revolutionizing the way we create and consume content.",
      author: "Alice Wonderland",
      date: "July 12, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "ai-content-creation",
    },
    {
      title: "Mastering Tailwind CSS for Rapid UI Development",
      description:
        "Unlock the full potential of Tailwind CSS to build beautiful and responsive interfaces faster.",
      author: "Bob Builder",
      date: "July 11, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "mastering-tailwind-css",
    },
    {
      title: "A Deep Dive into WebAssembly and its Applications",
      description:
        "Explore the power of WebAssembly and how it's enabling high-performance web applications.",
      author: "Charlie Chaplin",
      date: "July 9, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "webassembly-deep-dive",
    },
    {
      title: "The Importance of Accessibility in Web Design",
      description:
        "Learn why designing for accessibility is crucial for a truly inclusive web experience.",
      author: "Diana Prince",
      date: "July 8, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "web-accessibility-importance",
    },
    {
      title: "Serverless Functions: A Game Changer for Backend Development",
      description:
        "Discover the benefits of serverless architecture and how to deploy your first function.",
      author: "Eve Adams",
      date: "July 7, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "serverless-functions",
    },
    {
      title: "Optimizing React Performance: Tips and Tricks",
      description:
        "Boost your React application's speed and responsiveness with these expert optimization techniques.",
      author: "Frankenstein",
      date: "July 6, 2025",
      imageUrl: "/placeholder.svg?height=225&width=400",
      slug: "react-performance-tips",
    },
  ]

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
          Explore Blog Posts
        </h1>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts by title or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Technology
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Programming
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          AI & ML
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Web Development
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Design
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Productivity
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-1 text-base cursor-pointer hover:bg-accent"
        >
          Tutorials
        </Badge>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} {...post} />
        ))}
      </div>
    </main>
  )
}
