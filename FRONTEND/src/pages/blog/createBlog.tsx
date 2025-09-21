import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardMedia,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Visibility,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

interface CreateBlogData {
  title: string;
  content: string;
  image: string;
}

const CreateBlogPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useAuth();
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<CreateBlogData>({
    defaultValues: {
      title: '',
      content: '',
      image: '',
    },
  });

  const watchedFields = watch();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('image', {
        type: 'manual',
        message: 'Please select a valid image file',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('image', {
        type: 'manual',
        message: 'File size must be less than 5MB',
      });
      return;
    }

    clearErrors('image');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', 'Blog Image');
      formData.append('description', 'Image for blog post');

      const response = await API.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(progress);
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upload image');
      }

      const imageUrl = response.data.data.url;
      setUploadedImageUrl(imageUrl);
      setValue('image', imageUrl);
      showNotification('Image uploaded successfully!', 'success');
      return imageUrl;
    } catch (error: any) {
      console.error('Image upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      setError('image', { type: 'manual', message: errorMessage });
      showNotification(errorMessage, 'error');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setValue('image', '');
    clearErrors('image');
  };

  const onSubmit = async (data: CreateBlogData) => {
    try {
      let imageUrl = uploadedImageUrl;

      // Upload image if selected but not uploaded
      if (selectedFile && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // Upload failed
      }

      // Create blog post
      const blogData = {
        title: data.title.trim(),
        content: data.content.trim(),
        image: imageUrl,
      };

      const response = await API.post('/api/blog', blogData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create blog');
      }

      showNotification('Blog created successfully!', 'success');
      navigate(`/blog/${response.data.data.slug}`);
    } catch (error: any) {
      console.error('Create blog error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create blog';
      showNotification(errorMessage, 'error');
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  const handlePreview = () => {
    // Simple preview - you could implement a modal with formatted content
    if (watchedFields.title || watchedFields.content) {
      showNotification('Preview functionality can be enhanced with a modal', 'info');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Create New Blog Post
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share your thoughts and ideas with the world
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Title Field */}
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title must be at least 5 characters long',
              },
              maxLength: {
                value: 200,
                message: 'Title must be less than 200 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Blog Title"
                placeholder="Enter an engaging title for your blog..."
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Featured Image
            </Typography>
            
            {!imagePreview ? (
              <Card
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload featured image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG, JPG, GIF up to 5MB
                </Typography>
              </Card>
            ) : (
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => window.open(imagePreview, '_blank')}
                    sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={removeImage}
                    sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                {selectedFile && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.name}
                    </Typography>
                    {!uploadedImageUrl && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={uploadImage}
                        disabled={isUploading}
                        sx={{ mt: 1 }}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    )}
                  </Box>
                )}
              </Card>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}

            {errors.image && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.image.message}
              </Alert>
            )}
          </Box>

          {/* Content Field */}
          <Controller
            name="content"
            control={control}
            rules={{
              required: 'Content is required',
              minLength: {
                value: 20,
                message: 'Content must be at least 20 characters long',
              },
              maxLength: {
                value: 50000,
                message: 'Content must be less than 50,000 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Blog Content"
                placeholder="Write your blog content here..."
                multiline
                rows={15}
                margin="normal"
                error={!!errors.content}
                helperText={
                  errors.content?.message ||
                  `${field.value.length} characters`
                }
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Error Alert */}
          {errors.root && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.root.message}
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handlePreview}
              disabled={!watchedFields.title && !watchedFields.content}
            >
              Preview
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={isSubmitting || isUploading}
              size="large"
            >
              {isSubmitting ? 'Creating...' : 'Create Blog'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Writing Tips */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          💡 Writing Tips
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Use engaging titles" size="small" />
          <Chip label="Add featured images" size="small" />
          <Chip label="Structure with paragraphs" size="small" />
          <Chip label="Proofread before publishing" size="small" />
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateBlogPage;