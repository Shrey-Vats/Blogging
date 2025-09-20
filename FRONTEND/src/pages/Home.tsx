import API from "@/api/api";
import { Button } from "@/components/ui/button"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";

interface BlogType {
    title: string;
    slug: string;
    content?: string;
    createdAt?: string;
}

function Home() {
    const [data, setData] = React.useState<BlogType[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBlogs() {
            try {
                setLoading(true);
                const response = await API.get(`/api/blog/my-blogs`);
            
                console.log(response)
                if(response.data.success){
                    setData(response.data.data);
                } else {
                    setError("Failed to fetch blogs");
                }
            } catch (error: any) {
                console.error('Fetch blogs error:', error);
                setError(error.response?.data?.message || "Failed to fetch blogs");
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const handleCreateBlog = () => {
        navigate('/create');
    };

    const handleBlogClick = (slug: string) => {
        navigate(`/blog/${slug}`);
    };

    if (loading) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading blogs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
              

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )} 

                {/* Blog List */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.length > 0 ? (
                        data.map((blog: BlogType) => (
                            <div
                                key={blog.slug}
                                onClick={() => handleBlogClick(blog.slug)}
                                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer hover:border-primary/20"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {blog.title}
                                </h2>
                                {blog.content && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                        {blog.content.substring(0, 100)}...
                                    </p>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                                        Read More
                                    </span>
                                    {blog.createdAt && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No blogs yet</h3>
                            <p className="text-gray-500 mb-4">Be the first to create a blog post!</p>
                            <Button onClick={handleCreateBlog}>Create Your First Blog</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
