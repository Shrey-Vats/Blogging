import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import MuiThemeProvider from './components/theme/MuiThemeProvider';
import LoginPage from './pages/auth/login.page';
import RegisterPage from './pages/auth/register.page';
import PrivateRoute from './router/PrivateRoute';
import Layout from './components/layout/layout';
import HomePage from './pages/Home';
import BlogPage from './pages/Blog.page';
import CreateBlogPage from './pages/blog/createBlog';
import { AuthProvider } from './context/AuthContext';
import MuiThemeProvider from './MuiThemeProvider';
// import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './components/auth/PrivateRoute';
// import Layout from './components/layout/Layout';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import HomePage from './pages/HomePage';
// import BlogPage from './pages/BlogPage';
// import CreateBlogPage from './pages/CreateBlogPage';

const App: React.FC = () => {
  return (
    <MuiThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/sign-up" element={<RegisterPage />} />

            {/* Protected routes with layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog/:slug" element={<BlogPage />} />
                <Route path="/create" element={<CreateBlogPage />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default App;