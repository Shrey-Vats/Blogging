import { useNavigate } from "react-router-dom";

interface Blog {
  title: string;
  slug: string;
}

function BlogList({ data }: { data: Blog[] }) {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((blog: Blog) => (
          <div
            key={blog.slug}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {blog.title}
            </h2>
            <p className="text-sm text-gray-500">
              A short description could go here…
            </p>
            <button className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
