import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, MessageSquare, Heart, Share2, Bookmark, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatar: string;
}

const SinglePostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock post data
  const post = {
    id: id || '1',
    title: 'Getting Started with Modern Web Development',
    content: `
      <p>Modern web development has evolved significantly over the past few years. With the introduction of new frameworks, tools, and methodologies, developers now have more power and flexibility than ever before.</p>
      
      <h2>The Evolution of Web Development</h2>
      <p>Web development has come a long way since the early days of static HTML pages. Today's developers work with dynamic, interactive applications that provide rich user experiences across multiple devices and platforms.</p>
      
      <h3>Key Technologies</h3>
      <ul>
        <li>React and Vue.js for component-based UIs</li>
        <li>TypeScript for type-safe JavaScript</li>
        <li>CSS frameworks like Tailwind CSS</li>
        <li>Build tools like Vite and Webpack</li>
      </ul>
      
      <p>The modern web development ecosystem is vast and constantly evolving. New tools and frameworks are released regularly, each promising to make development faster, more efficient, or more enjoyable.</p>
      
      <h3>Best Practices</h3>
      <p>When building modern web applications, it's important to follow established best practices:</p>
      
      <ol>
        <li>Write clean, maintainable code</li>
        <li>Use version control effectively</li>
        <li>Implement proper testing strategies</li>
        <li>Optimize for performance</li>
        <li>Ensure accessibility compliance</li>
      </ol>
      
      <p>By following these practices and staying up-to-date with the latest developments in the field, you can build applications that are not only functional but also scalable and maintainable.</p>
    `,
    author: 'John Doe',
    publishDate: 'November 15, 2024',
    readTime: '5 min read',
    tags: ['Web Development', 'React', 'TypeScript', 'Tutorial'],
    likes: 142,
    image: 'https://via.placeholder.com/800x400'
  };

  const comments: Comment[] = [
    {
      id: '1',
      author: 'Sarah Wilson',
      content: 'Great article! This really helped me understand the modern development workflow. Looking forward to more content like this.',
      date: 'November 16, 2024',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: '2',
      author: 'Mike Chen',
      content: 'Thanks for sharing this. The section on best practices was particularly useful. Do you have any recommendations for testing frameworks?',
      date: 'November 16, 2024',
      avatar: 'https://via.placeholder.com/40x40'
    },
    {
      id: '3',
      author: 'Emily Rodriguez',
      content: 'Excellent breakdown of modern web dev tools. I\'ve been using React for a while but TypeScript is new to me. This gives me a good starting point.',
      date: 'November 15, 2024',
      avatar: 'https://via.placeholder.com/40x40'
    }
  ];

  const relatedPosts = [
    {
      id: '2',
      title: 'The Future of JavaScript Frameworks',
      excerpt: 'Exploring the latest trends and innovations in JavaScript frameworks...',
      image: 'https://via.placeholder.com/200x120'
    },
    {
      id: '3',
      title: 'Building Responsive Layouts with CSS Grid',
      excerpt: 'Master CSS Grid to create beautiful, responsive layouts...',
      image: 'https://via.placeholder.com/200x120'
    }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Handle comment submission
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FF5722] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="bg-white rounded-lg px-3 py-1">
                <span className="text-[#FF5722] font-bold text-xl">Blogger</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-white hover:text-white/80 px-3 py-2">
                Dashboard
              </Link>
              <Link to="/create" className="bg-white text-[#FF5722] px-4 py-2 rounded hover:bg-gray-50">
                Write
              </Link>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <Link to={`/profile/${post.author.toLowerCase().replace(' ', '')}`} className="hover:text-[#FF5722]">
                {post.author}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Featured Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post Actions */}
        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes + (isLiked ? 1 : 0)}</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <MessageSquare size={20} />
                <span>{comments.length}</span>
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center space-x-2 ${isBookmarked ? 'text-[#FF5722]' : 'text-gray-600'} hover:text-[#FF5722]`}
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span>Save</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Share:</span>
              <button
                onClick={() => handleShare('facebook')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="text-blue-400 hover:text-blue-500"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="text-gray-600 hover:text-gray-700"
              >
                <LinkIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h3 className="text-2xl text-gray-900 mb-6">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Join the discussion..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-[#FF5722] text-white px-6 py-2 rounded hover:bg-[#E64A19]"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900">{comment.author}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <button className="hover:text-gray-700">Reply</button>
                    <button className="hover:text-gray-700">Like</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Posts */}
        <section>
          <h3 className="text-2xl text-gray-900 mb-6">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={relatedPost.image}
                  alt={relatedPost.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg text-gray-900 mb-2 hover:text-[#FF5722] cursor-pointer">
                    <Link to={`/post/${relatedPost.id}`}>{relatedPost.title}</Link>
                  </h4>
                  <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 Blogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SinglePostPage;