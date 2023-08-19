import { useState } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { generateComment, updateLikes, deleteBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'
import { Typography, Tooltip, TextField, Button, Box, ListItem, ListItemText, Stack, Card } from '@mui/material'
import LikeIcon from '@mui/icons-material/Favorite'

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

  const reversedComments = [ ...blog.comments].reverse()

  return (
    <div>
      <div>
        <div className="blog">
          <Typography variant='h4'>{blog.title} {blog.author}</Typography>
          <Typography component='a' href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</Typography>
          <Box display='flex' alignItems='center' justifyContent='left' >
            <Typography variant='caption' component={Stack} direction='row' alignItems='center' px={{ marginRight: '10px' }}>
              {blog.likes} likes
              <Tooltip title='Press to like the blog'>
                <LikeIcon onClick={updateBlog} sx={{ marginLeft: 1, fontSize:'30px', '&:hover': { opacity:'80%' } }} />
              </Tooltip>
            </Typography>
          </Box>
          <Typography>added by <strong>{blog.user.name}</strong></Typography>
          {user.username === blog.user.username &&
          <div>
            <Button variant='contained' onClick={removeAll}>remove</Button>
            <br />
            <br />
          </div>
          }
        </div>
      </div>
      <br />
      <div>
        <Typography variant='h5'>Comments</Typography>
        <form>
          <div>
            <div>
              <TextField variant="outlined" size="small"
                type="text"
                value={value}
                name="comment"
                onChange={({ target }) => setValue(target.value)}
                placeholder='write a comment'
              />
            </div>
            <Button variant='contained' onClick={addComment}>add comment </Button>
          </div>
        </form>
        <Card sx={{ maxWidth: '700px', backgroundColor: 'primary.light', overflow: 'auto', maxHeight: '500px' }}>
          {reversedComments.map((comment, index) =>
            <ListItem key={index} divider px={{ fontSize: '50px' }}>
              <ListItemText disableTypography>
                <Typography variant='caption' >
                  {comment}
                </Typography>
              </ListItemText>
            </ListItem>
          )}
        </Card>
      </div>
      <footer>
        <Box sx={{ height:'30px' }}></Box>
      </footer>
    </div>
  )}

export default Blog