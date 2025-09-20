// FRONTEND/src/components/blog/blogCreateForm.tsx
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import API from "@/api/api"

type BlogFormData = {
  title: string
  content: string
  image: string 
}


function BlogCreateForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<BlogFormData>()

  const onSubmit = async (data: BlogFormData) => {
    try {
      const response = await API.post(`/api/blog`, {
        title: data.title,
        content: data.content,
        image: data.image || "https://via.placeholder.com/400x200",
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Blog created successfully!")
        reset()
        navigate("/")
      }
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Failed to create blog"
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create a New Blog Post
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            placeholder="Enter blog title"
            {...register("title", { 
              required: "Title is required",
              minLength: { value: 5, message: "Title must be at least 5 characters" }
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            placeholder="Write your blog content..."
            className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition resize-none"
            {...register("content", {
              required: "Content is required",
              minLength: { value: 20, message: "Content must be at least 20 characters" },
            })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
            Image URL
          </label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("image", {
              pattern: {
                value: /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i,
                message: "Please enter a valid image URL"
              }
            })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            {isSubmitting ? "Creating..." : "Create Blog Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogCreateForm