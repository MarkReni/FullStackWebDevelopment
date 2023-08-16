import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generateBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'

const Home = ({ user, blogs }) => {
  const dispatch = useDispatch()

  const togglableRef = useRef()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility()

    dispatch(generateBlog(blogObject, user))
  }

  return(
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel='create new blog' ref={togglableRef}>
        <h2>create new</h2>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <span>
        {blogs.map(blog =>
          <div style={blogStyle} key={blog.id}>
            <Link  to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </div>
        )}
      </span>
    </div>
  )
}

export default Home