import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import axios from "axios"

type BlogFormData = {
  title: string
  content: string
  image: FileList
}

function BlogCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogFormData>()

  const URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  const onSubmit = async (data: BlogFormData) => {
    console.log("Form submitted:", data)
    try {
        const response = await axios.post(`${URL}/blogs`, {
            title: data.title,
            content: data.content,
        })

        if (response.data.success) {
            alert("Blog created successfully!")
            reset()
        }
    } catch (error) {
        
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create a New Blog Post
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <Input
            id="title"
            placeholder="Enter blog title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            placeholder="Write your blog content..."
            className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition resize-none"
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 20,
                message: "Content must be at least 20 characters",
              },
            })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="image"
          >
            Upload Image
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            {isSubmitting ? "Submitting..." : "Create Blog Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogCreateForm
