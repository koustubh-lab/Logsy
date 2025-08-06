import { createBlogForUserApi } from "@/api/PostApiService"
import FullSizeLoader from "@/components/FullSizeLoader"
import { MultiSelectCombobox } from "@/components/MultiValueSelectComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { options } from "@/utils/TagOptions"
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

export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedValues, setSelectedValues] = useState([])
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
    try {
      const { status } = await createBlogForUserApi(
        title,
        content,
        description,
        selectedValues
      )
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto mt-10 p-4 grid gap-5"
    >
      {loading && <FullSizeLoader />}
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
          className="text-sm sm:text-base text-primary"
          placeholder="Ex. Getting started with React and Typescript"
          maxLength={100}
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
          className="text-sm sm:text-base text-primary"
          placeholder="Ex. This post is about this and that"
          onChange={handleDescriptionChange}
          value={description}
          maxLength={400}
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
            placeholder="Start typing from here"
            onChange={handleChange}
            modules={modules}
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
