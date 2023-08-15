import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, generateBlog, updateLikes, deleteBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const togglableRef = useRef()

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

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility()

    try {
      dispatch(generateBlog(blogObject, user))
      dispatch(setNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`, false, 2))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }

  const increaseLikes = async (blogObject, blogUser) => {
    try {
      dispatch(updateLikes(blogObject, blogUser))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }

  const removeBlog = async (blogToDelete) => {
    try {
      if(window.confirm(`remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
        blogService.setToken(user.token)
        dispatch(deleteBlog(blogToDelete.id))
        dispatch(setNotification(`A blog ${blogToDelete.title} by ${blogToDelete.author} was deleted`, false, 2))
      }
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    window.location.reload(false)
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

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
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <Button text={'logout'} handleClick={handleLogout} color={''} />
          </p>
          <Togglable buttonLabel='create new blog' ref={togglableRef}>
            <h2>create new</h2>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
          <br />
          <span>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} user={user} increaseLikes={increaseLikes} removeBlog={removeBlog} />
            )}
          </span>
        </div>
      }
    </div>
  )
}

export default App