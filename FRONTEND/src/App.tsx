import './App.css'
import LoginPage from './pages/auth/login.page'
import {Route, Routes, BrowserRouter} from "react-router-dom"
import RegisterPage from './pages/auth/register.page'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './router/PrivateRoute'
import BlogCreateForm from './components/blog/blogCreateForm'
import Blog from './pages/Blog.page'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/sign-in' element={<LoginPage />}/>
          <Route path='/sign-up' element={<RegisterPage />} />
            <Route path='/' element={<Home />}/>
            <Route path='/blog/:slug' element={<Blog />}/>
            <Route path='/create' element={<BlogCreateForm />} />
          <Route element={<PrivateRoute />}>
          </Route>
          {/* Fallback route */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;