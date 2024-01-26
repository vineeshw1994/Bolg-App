import { Routes, BrowserRouter, Route } from "react-router-dom"
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import Footer from "./components/Footer"
import CreatePost from './pages/CreatePost'
import PrivateRoute from "./components/PrivateRoute.jsx"
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx'
import UpdatePost from "./pages/UpdatePost.jsx"
import PostPage from "./pages/PostPage.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />

        </Route>

        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>

  )
}

export default App