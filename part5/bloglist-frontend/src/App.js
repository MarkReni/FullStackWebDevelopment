import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

let errorOn = false

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setNotification('Wrong username or password')
      errorOn = true
      setTimeout(() => {
        setNotification(null)
        errorOn = false
      }, 2000)
    }
  }

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(sortByLikes(blogs.concat({ ...returnedBlog, user: user })))
      setNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch(exception) {
      errorOn = true
      setNotification(`${exception.response.data.error}`)
    }
    setTimeout(() => {
      setNotification(null)
      errorOn = false
    }, 2000)
  }

  const increaseLikes = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject)
      setBlogs(sortByLikes(blogs.map(blog => blog.id !== blogObject.id ? blog : { ...returnedBlog, user: user })))
      //setNotification(`Likes of ${returnedBlog.title} by ${returnedBlog.author} increased`)
    } catch(exception) {
      errorOn = true
      setNotification(`${exception.response.data.error}`)
    }
    setTimeout(() => {
      setNotification(null)
      errorOn = false
    }, 2000)
  }

  const removeBlog = async (deleteBlog) => {
    try {
      if(window.confirm(`remove blog ${deleteBlog.title} by ${deleteBlog.author}`)) {
        blogService.setToken(user.token)
        await blogService.remove(deleteBlog.id)
        setBlogs(sortByLikes(blogs.filter(blog => blog.id !== deleteBlog.id)))
        setNotification(`A blog ${deleteBlog.title} by ${deleteBlog.author} was deleted`)
      }
    } catch(exception) {
      errorOn = true
      setNotification(`${exception.response.data.error}`)
    }
    setTimeout(() => {
      setNotification(null)
      errorOn = false
    }, 2000)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    window.location.reload(false)
  }

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(sortByLikes(blogs))
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Notification message={notification} errorOn={errorOn} />

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