import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, updateLikes, deleteBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user)
  const users = useSelector(({ users }) => users)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch(exception) {
      dispatch(setNotification('Wrong username or password', true, 2))
    }
  }

  const increaseLikes = async (blogObject, blogUser) => {
    dispatch(updateLikes(blogObject, blogUser))
  }

  const removeBlog = async (blogToDelete) => {
    if(window.confirm(`remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      blogService.setToken(user.token)
      dispatch(deleteBlog(blogToDelete, user))
      navigate('/')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    window.location.reload(false)
  }

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const matchUser = useMatch('/users/:id')
  const matchBlog = useMatch('/blogs/:id')

  const userFilter = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const blogFilter = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  return (
    <div>
      <Notification />

      {!user &&
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      }

      {user &&
        <div>
          <div className='navBar'>
            <Link className='link' to="/">blogs</Link>
            <Link className='link' to="/users">users</Link>
            {user.name} logged in { }
            <Button text={'logout'} handleClick={handleLogout} color={''} />
          </div>
          <Routes>
            <Route path="/blogs/:id" element={<Blog blog={blogFilter} user={user} increaseLikes={increaseLikes} removeBlog={removeBlog} />} />
            <Route path="/users/:id" element={<User user={userFilter} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/" element={<Home user={user} blogs={blogs} />} />
          </Routes>
        </div>
      }
    </div>
  )
}

export default App