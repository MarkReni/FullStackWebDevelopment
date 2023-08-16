import Button from './Button'

const Blog = ({ blog, user, increaseLikes, removeBlog }) => {
  const updateBlog = (event) => {
    event.preventDefault()

    increaseLikes({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id
    }, blog.user)
  }

  const removeAll = (event) => {
    event.preventDefault()

    removeBlog(blog)
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
    </div>
  )}

export default Blog