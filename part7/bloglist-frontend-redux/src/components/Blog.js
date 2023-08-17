import Button from './Button'
import { useState } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { generateComment, updateLikes, deleteBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog }) => {
  const [value, setValue] = useState('')
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const updateBlog = (event) => {
    event.preventDefault()

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id,
      comments: blog.comments
    }

    dispatch(updateLikes(updatedBlog, blog.user))
  }

  const removeAll = (event) => {
    event.preventDefault()

    if(window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      blogService.setToken(user.token)
      dispatch(deleteBlog(blog, user))
      navigate('/')
    }
  }

  const addComment = (event) => {
    event.preventDefault()

    setValue('')
    dispatch(generateComment(blog, value))
  }

  if(!blog) {
    return null
  }

  return (
    <div>
      <div>
        <div className="blog">
          <h2>{blog.title} {blog.author}</h2>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          <div>
            {blog.likes} likes
            <Button text='like' handleClick={updateBlog} color={''} />
          </div>
          <div>added by {blog.user.name}</div>
          {user.username === blog.user.username &&
          <Button
            text='remove'
            handleClick={removeAll}
            color={'blue'}
          />
          }
        </div>
      </div>
      <div>
        <h3>comments</h3>
        <form onSubmit={addComment}>
          <input
            type="text"
            value={value}
            name="comment"
            onChange={({ target }) => setValue(target.value)}
            placeholder='write a comment'
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) =>
            <li key={index}>{comment}</li>)}
        </ul>
      </div>
    </div>
  )}

export default Blog