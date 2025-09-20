import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/login.page";
import RegisterPage from "./pages/auth/register.page";
import Home from "./pages/Home";
import Blog from "./pages/Blog.page";
import CreatePostPage from "./components/blog/CreateBlogPage";

import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/layout";

// Layout Components



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />

          {/* Routes with global layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/create" element={<CreatePostPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
