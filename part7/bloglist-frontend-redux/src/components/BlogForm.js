import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
    title:
      <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
        placeholder='writeTitle'
      />
      <br />
    author:
      <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
        placeholder='writeAuthor'
      />
      <br />
    url:
      <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
        placeholder='writeUrl'
      />
      <br />
      <button type="submit" id='create-button'>create</button>
    </form>
  )}

export default BlogForm