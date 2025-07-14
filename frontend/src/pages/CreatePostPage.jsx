import { createBlogForUserApi } from "@/api/PostApiService"
import { MultiSelectCombobox } from "@/components/MultiValueSelectComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import hljs from "highlight.js"
import { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    ["code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
}

// Parent container animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: "easeOut",
    },
  },
}

// Child element animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

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

export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedValues, setSelectedValues] = useState([])

  const navigate = useNavigate()

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }
  const handleDescriptionChange = (e) => setDescription(e.target.value)
  const handleChange = (value) => setContent(value)
  const handleSubmit = async () => {
    if (content === "" || title === "") {
      toast.error("Filling every field is important for posting a blog")
    }

    try {
      const { status } = await createBlogForUserApi(title, content, description, selectedValues)
      if (status === 200) {
        toast.success("Congratulations!!!", {
          description: "Post created successfully",
        })
        setTitle("")
        setContent("")
        setTimeout(() => {
          navigate(-1)
        }, 1000)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.status)
      } else if (error.request) {
        toast.error("Ensure that you have a stable internet connection")
      } else {
        toast.error("Server error")
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto mt-10 p-4 grid gap-5"
    >
      <motion.h1
        variants={fadeUp}
        className="font-semibold text-2xl sm:text-3xl capitalize"
      >
        Write a blog you desire...
      </motion.h1>

      <motion.div variants={fadeUp} className="grid gap-2">
        <Label htmlFor="post-title" className="capitalize font-bold">
          post title{" "}
        </Label>
        <Input
          id="post-title"
          name="post-title"
          className="text-sm sm:text-base"
          placeholder="Ex. Getting started with React and Typescript"
          maxLength={70}
          onChange={handleTitleChange}
          value={title}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-2">
        <Label htmlFor="post-title" className="capitalize font-bold">
          post description{" "}
        </Label>
        <Input
          id="post-title"
          name="post-title"
          className="text-sm sm:text-base"
          placeholder="Ex. This post is about this and that"
          onChange={handleDescriptionChange}
          value={title}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-2">
        <Label htmlFor="post-title" className="capitalize font-bold">
          post tags{" "}
        </Label>
        <MultiSelectCombobox
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          options={options}
          placeholder="Select tags for blog"
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-2">
        <p className="capitalize text-sm font-bold">post content</p>
        <div>
          <ReactQuill
            value={content}
            onChange={handleChange}
            modules={modules}
            theme="snow"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Button onClick={handleSubmit} className="mt-4">
          Post Blog
        </Button>
      </motion.div>
    </motion.div>
  )
}
