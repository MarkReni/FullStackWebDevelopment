import { useState } from 'react'
import Button from './Button'

const Blog = ({ blog, user, increaseLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const updateBlog = (event) => {
    event.preventDefault()

    increaseLikes({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id
    })
  }

  const removeAll = (event) => {
    event.preventDefault()

    removeBlog(blog)
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="togglableBlogContentShown">
        {blog.title} {blog.author}
        <Button text='view' handleClick={toggleVisibility} color={''} />
      </div>
      <div style={showWhenVisible} className="togglableBlogContentNotShown">
        <div className="blog">
          <div>
            {blog.title} {blog.author}
            <Button text='hide' handleClick={toggleVisibility} color={''} />
          </div>
          <div>{blog.url}</div>
          <div>
          likes {blog.likes}
            <Button text='like' handleClick={updateBlog} color={''} />
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username &&
          <Button
            text='remove'
            handleClick={removeAll}
            color={'blue'}
          />
          }
        </div>
      </div>
    </div>
  )}

export default Blog