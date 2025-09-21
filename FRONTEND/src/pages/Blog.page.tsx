import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  Person,
  AccessTime,
} from '@mui/icons-material';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

interface BlogData {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const BlogPage: React.FC = () => {
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const { showNotification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError('Blog not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/api/blog/${slug}`);

        if (!response.data.success) {
          setError(response.data.message || 'Failed to load blog');
        } else {
          setBlog(response.data.data);
        }
      } catch (err: any) {
        console.error('Fetch blog error:', err);
        const errorMessage = err.response?.data?.message || 'Something went wrong';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, showNotification]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Blog not found'}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      {/* Blog Article */}
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* Featured Image */}
        {blog.image && (
          <Box
            component="img"
            src={blog.image}
            alt={blog.title}
            sx={{
              width: '100%',
              height: { xs: 250, md: 400 },
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Article Content */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          {/* Blog Title */}
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            {blog.title}
          </Typography>

          {/* Author and Meta Information */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {getInitials(blog.user.name)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {blog.user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blog.user.email}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(blog.createdAt)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {getReadingTime(blog.content)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Blog Content */}
          <Box
            sx={{
              '& > *': { mb: 2 },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 'bold',
                mt: 3,
                mb: 2,
                color: 'text.primary',
              },
              '& h1': { fontSize: '2.5rem' },
              '& h2': { fontSize: '2rem' },
              '& h3': { fontSize: '1.75rem' },
              '& h4': { fontSize: '1.5rem' },
              '& h5': { fontSize: '1.25rem' },
              '& h6': { fontSize: '1rem' },
              '& p': {
                lineHeight: 1.7,
                fontSize: '1.1rem',
                color: 'text.primary',
                mb: 2,
              },
              '& ul, & ol': {
                pl: 3,
                '& li': {
                  mb: 1,
                  lineHeight: 1.6,
                },
              },
              '& blockquote': {
                borderLeft: 4,
                borderLeftColor: 'primary.main',
                bgcolor: 'grey.50',
                p: 2,
                my: 3,
                borderRadius: 1,
                fontStyle: 'italic',
              },
              '& code': {
                bgcolor: 'grey.100',
                color: 'primary.dark',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: 'monospace',
              },
              '& pre': {
                bgcolor: 'grey.900',
                color: 'common.white',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                '& code': {
                  bgcolor: 'transparent',
                  color: 'inherit',
                },
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                boxShadow: 2,
                my: 2,
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content.replace(/\n/g, '<br />'),
              }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Article Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Published on {formatDate(blog.createdAt)}
                {blog.updatedAt !== blog.createdAt && (
                  <>
                    {' • '}
                    Updated on {formatDate(blog.updatedAt)}
                  </>
                )}
              </Typography>
            </Box>
            <Chip
              label="Published"
              color="primary"
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* Back to Top Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </Button>
      </Box>
    </Container>
  );
};

export default BlogPage;