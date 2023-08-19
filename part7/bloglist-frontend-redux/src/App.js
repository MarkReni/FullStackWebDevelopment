import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import {
  Routes,
  Route,
  Link,
  useMatch
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Stack, Button, Typography, colors, Avatar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      light: '#f8bbd0',
      main: '#f06292',
      dark: '#ec407a',
      contrastText: '#880e4f',
    },
    secondary: colors.purple
  },
  typography: {
    fontFamily: 'Monospace, Arial',
    fontSize: 16
  },
  components: {
    MuiContainer: {
      styleOverrides: {
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 20,
          fontWeight: 700,
          fontFamily: 'Oswald, Arial'
        },
        contained: {
          fontFamily: 'sans-serif',
          fontWeight: 'lighter',
          fontSize: 17,
          padding: '1px 10px',
          marginTop: '5px'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          height: '10px',
          marginBottom: 40,
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #f8bbd0 inset',
              WebkitTextFillColor: 'default',
            },
          },
        },
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: 15,
          fontFamily: 'Barlow Arial',
          color: '#880e4f'
        },
        caption: {
          marginBottom: 0,
          fontSize: 17
        }
      }
    },
  }
})

const App = () => {
  const dispatch = useDispatch()

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

  const imageLink = 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ backgroundColor: 'primary.light', minHeight: '800px', maxHeight: '1000px', minWidth: '300px', maxWidth: '1000px' }}>
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
          <div>
            <AppBar color="primary" position="static" elevation={1} sx={{ marginBottom: '20px' }}>
              <Toolbar variant="dense" >
                <Stack direction='row' spacing={2} sx={{ flexGrow: 0.95 }} >
                  <Button color="inherit" component={Link} to="/">
                    blogs
                  </Button>
                  <Button color="inherit" component={Link} to="/users">
                    users
                  </Button>
                </Stack>
                <Avatar alt="Random image" src={imageLink} />
                <Typography variant="h7" sx={{ m: 2, fontStyle: 'italic' }}>
                  {user.name} logged in { }
                </Typography>
                <Button variant='contained' onClick={handleLogout}>logout</Button>
              </Toolbar>
            </AppBar>
          </div>
          <Routes>
            <Route path="/blogs/:id" element={<Blog blog={blogFilter} />} />
            <Route path="/users/:id" element={<User user={userFilter} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
          }
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default App