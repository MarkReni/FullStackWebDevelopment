import { useState } from 'react'
import { TextField, Button } from '@mui/material'

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
      <div>
        <div>
          <TextField variant="outlined" size="small"
            label='title'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='writeTitle'
          />
        </div>
        <div>
          <TextField variant="outlined" size="small"
            label='author'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='writeAuthor'
          />
        </div>
        <div>
          <TextField variant="outlined" size="small"
            label='url'
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='writeUrl'
          />
        </div>
        <Button variant="contained" type="submit" id='create-button'>
          create
        </Button>
      </div>
    </form>
  )}

export default BlogForm