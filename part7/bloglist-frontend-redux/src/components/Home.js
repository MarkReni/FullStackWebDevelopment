import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import { Typography, Box } from '@mui/material'

const Home = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user)

  const togglableRef = useRef()

  const blogStyle = {
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 1,
    maxWidth: '1000px',
    height: '30px',
    textDecoration: 'none'
  }

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility()

    dispatch(generateBlog(blogObject, user))
  }

  return(
    <div>
      <Typography variant='h4'>Blogs</Typography>
      <Togglable buttonLabel='create new blog' ref={togglableRef}>
        <Typography variant='h6'>create a new blog</Typography>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <span>
        {blogs.map(blog =>
          <Box display='flex' alignItems='center' justifyContent='left' component={Link} sx={blogStyle} key={blog.id} to={`/blogs/${blog.id}`}>
            <Typography variant='caption'>{blog.title} {blog.author}</Typography>
          </Box>
        )}
      </span>
    </div>
  )
}

export default Home