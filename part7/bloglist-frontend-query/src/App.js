import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import Button from './components/Button'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch, useUserContent } from './UserContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const dispatchUser = useUserDispatch()
  const { user } = useUserContent()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const togglableRef = useRef()

  const sortByLikes = (blogs) => {
    if(!blogs) return
    else return blogs.sort((a, b) => b.likes - a.likes)
  }

  const clearNotification = () => {
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR' })
    }, 2000)
  }

  const showError = (exception) => {
    dispatchNotification({
      type: 'DISPLAY',
      payload: {
        notification: `${exception.response.data.error}`,
        errorOn: true
      }
    })
  }

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', sortByLikes(blogs.concat({ ...newBlog, user: user })))
      dispatchNotification({
        type: 'DISPLAY',
        payload: {
          notification: `A new blog ${newBlog.title} by ${newBlog.author} added`,
          errorOn: false
        }
      })
    },
    onError: (exception) => showError(exception),
    onSettled: () => clearNotification()
  })

  const updateBlogMutation = useMutation({
    mutationFn: (variables) => {
      return blogService.update(variables.blogObject)
    },
    onSuccess: (data, variables) => {
      const blogs = queryClient.getQueryData('blogs')
      const updatedBlog = { ...variables.blogObject, user: variables.user }
      queryClient.setQueryData('blogs', sortByLikes(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)))
    },
    onError: (exception) => showError(exception),
    onSettled: () => clearNotification()
  })

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (data, removedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', sortByLikes(sortByLikes(blogs.filter(blog => blog.id !== removedBlog.id))))
      dispatchNotification({
        type: 'DISPLAY',
        payload: {
          notification: `A blog ${removedBlog.title} by ${removedBlog.author} was deleted`,
          errorOn: false
        }
      })
    },
    onError: (exception) => showError(exception),
    onSettled: () => clearNotification()
  })

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
      dispatchUser({
        type: 'SET',
        payload: {
          user: user
        }
      })
      setUsername('')
      setPassword('')
    } catch(exception) {
      dispatchNotification({
        type: 'DISPLAY',
        payload: {
          notification: 'Wrong username or password',
          errorOn: true
        }
      })
      clearNotification()
    }
  }

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility()

    newBlogMutation.mutate(blogObject)
  }

  const increaseLikes = async (blogObject, user) => {
    updateBlogMutation.mutate({ blogObject, user })
  }

  const removeBlog = async (deleteBlog) => {
    if(window.confirm(`remove blog ${deleteBlog.title} by ${deleteBlog.author}`)) {
      blogService.setToken(user.token)
      removeBlogMutation.mutate(deleteBlog)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    window.location.reload(false)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatchUser({
        type: 'SET',
        payload: {
          user: user
        }
      })
      blogService.setToken(user.token)
    }
  }, [])

  const { data, isLoading, error } = useQuery(
    'blogs', blogService.getAll,
    {
      refetchOnWindowFocus: false,
      retry: 1
    }
  )

  if(error) {
    return(
      <div>blogs service not available due to problems in server</div>
    )
  }

  const blogs = sortByLikes(data)

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

          {!isLoading &&
          <span>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} user={user} increaseLikes={increaseLikes} removeBlog={removeBlog} />
            )}
          </span>
          }

          {isLoading &&
            <div>loading data...</div>
          }

        </div>
      }
    </div>
  )
}

export default App