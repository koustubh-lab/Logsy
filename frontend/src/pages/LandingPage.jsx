import { sendContactRequestApi } from "@/api/ContactApiService"
import { getAllPostsForUserByPageApi } from "@/api/PostApiService"
import { BlogPostCard } from "@/components/BlogPostCard"
import ContactCard from "@/components/ContactCard"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useAuth from "@/context/AuthContext"
import { getErrorMessage } from "@/utils/AxoisErrorHandler"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Inbox,
  Mail,
  MapPin,
  MoveRight,
  Phone,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.5, // You can increase to 1 if needed
      ease: "easeOut",
    },
  },
}

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])

  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/home/dashboard")
    }
  }, [isAuthenticated, authLoading])

  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleContactFormChange = (e) => {
    const { name, value } = e.target
    setContactFormData({ ...contactFormData, [name]: value })
  }

  const getAllPosts = async () => {
    try {
      const response = await getAllPostsForUserByPageApi(0, 6)
      const { status, data } = response
      if (status === 200) {
        console.log(data)
        setBlogPosts(data)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleContactFormSubmit = async () => {
    setLoading(true)

    try {
      const response = await sendContactRequestApi(contactFormData)
      const { status } = response
      if (status === 200) {
        toast.success("Message sent successfully")
        setContactFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPosts()
  }, [])

  return (
    <div className="min-h-screen landing-page-theme">
      <Navigation />

      <motion.section
        id="hero-section"
        className="border-b min-h-[100dvh] flex justify-center items-end bg-transparent custom-landing-page-background-image px-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
        }}
      >
        <motion.div
          className="container mx-auto grid gap-5 justify-items-center max-w-4xl py-20 lg:py-32"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
            },
          }}
        >
          <div>
            <Badge
              className={
                "bg-muted text-white p-2 px-6 rounded-full hover:bg-muted/70 space-x-3"
              }
            >
              <Inbox className="h-4 w-4" /> <span>Now Available</span>
            </Badge>
          </div>
          <motion.h1
            className=" text-gray-900 mb-4 text-center grid"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <span className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-bold leading-none">
              Built for Bloggers, Loved by Thinkers
            </span>
            {/* <span className="bg-gradient-to-r from-indigo-500 via-white to-indigo-500 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold pacifico leading-normal">
              Loved By Thinkers.
            </span> */}
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5 } },
            }}
          >
            <p className="text-muted-foreground text-center text-sm sm:text-xl">
              Logsy is a clean, distraction-free blogging platform with
              passwordless login and powerful tools — built to help you focus on
              your words.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col w-full sm:flex-row justify-center gap-3"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5 } },
            }}
          >
            <Link to="/register">
              <Button className="rounded-full w-full px-7 text-sm" size="lg">
                Get Started
                <MoveRight />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                className="rounded-full bg-muted/50 w-full px-7 text-sm hover:bg-muted text-foreground border"
                variant="ghost"
                size="lg"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="about"
        className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground"
      >
        <div
          className="container mx-auto px-4 md:px-6"
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tighter sm:text-5xl">
                About Logsy: Your Platform for Expression
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Logsy is built on the belief that everyone has a story to tell.
                We provide a seamless and beautiful environment for writers,
                thinkers, and creators to share their voice, engage with
                readers, and build a lasting online presence.
              </p>
            </div>
          </div>
          <div className="mx-auto grid justify-items-center max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <motion.img
              src="/about-us-section-image.png"
              width={550}
              height={310}
              alt="Person writing on a laptop"
              className="rounded-md border border-white brightness-90 aspect-video object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To empower individuals and communities to share their
                      unique perspectives and foster meaningful connections
                      through the art of blogging.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To be the most intuitive and inspiring platform for
                      content creation and discovery, where every voice finds
                      its audience.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Our Values</h3>
                    <p className="text-muted-foreground">
                      Creativity, community, simplicity, and authenticity are
                      the pillars of our platform.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="w-full py-12 md:py-24 lg:py-22 bg-background text-foreground"
      >
        <div
          className="container mx-auto px-4 md:px-6"
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tighter sm:text-5xl">
                Key Features for Bloggers
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Logsy offers a powerful suite of tools designed to make your
                blogging experience effortless and impactful.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <motion.div
                className="h-full"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 flex flex-col items-center text-center h-full hover:bg-muted/50 duration-300 cursor-default">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {
                      [
                        "Intuitive Editor",
                        "Audience Engagement",
                        "SEO Optimization",
                        "Customizable Themes",
                        "Analytics Dashboard",
                        "Monetization Options",
                      ][i]
                    }
                  </h3>
                  <p className="text-muted-foreground flex-1">
                    {
                      [
                        "Craft beautiful posts with our rich, easy-to-use content editor.",
                        "Foster discussions with comments, likes, and sharing options.",
                        "Boost your visibility with built-in tools to rank higher in search engines.",
                        "Personalize your blog's look and feel with a variety of elegant themes.",
                        "Understand your readers with comprehensive insights into your content's performance.",
                        "Explore various ways to monetize your content and grow your income.",
                      ][i]
                    }
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {blogPosts && blogPosts?.length > 0 && (
        <section
          className="container mx-auto px-4 py-16 bg-background text-foreground"
          id="explore-posts"
        >
          <motion.h2
            className="text-3xl sm:text-5xl text-center font-semibold text-primary mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Explore Posts
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BlogPostCard {...post} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <motion.section
        id="contact"
        className="w-full min-h-screen flex flex-col bg-background text-foreground"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid gap-6 justify-items-center pt-20 px-5">
          <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight">
            Contact Us
          </h2>
          <p className="max-w-[600px] text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have questions about Logsy or need assistance with your blog? Our
            team is here to help you every step of the way.
          </p>
        </div>
        <div className="container mx-auto flex-1 grid items-center px-4 xl:px-20">
          <div className="flex flex-col gap-10 sm:flex-row lg:gap-10 py-10 px-5 sm:py-5">
            <motion.div
              variants={fadeInUp}
              className="flex-1 space-y-2 align-top"
            >
              <div className="grid gap-4 rounded-md">
                <ContactCard icon={Mail} text="logsy.app@gmail.com" />
                <ContactCard icon={Phone} text="+1 (123) 456-7890" />
                <ContactCard
                  icon={MapPin}
                  text="123 Main Street, Anytown, India"
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex-1 flex flex-col gap-4 rounded-md"
            >
              <Input
                placeholder="Your Name"
                type="text"
                name="name"
                className="bg-muted/5"
                onChange={handleContactFormChange}
              />
              <Input
                placeholder="Your Email"
                type="email"
                name="email"
                className="bg-muted/5"
                onChange={handleContactFormChange}
              />
              <Input
                placeholder="Subject"
                type="text"
                className="bg-muted/5"
                name="subject"
                onChange={handleContactFormChange}
              />
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your Message"
                name="message"
                onChange={handleContactFormChange}
              />
              <Button
                type="submit"
                onClick={handleContactFormSubmit}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
