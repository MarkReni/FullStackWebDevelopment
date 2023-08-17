import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'
import { addToUser } from '../reducers/usersReducer'
import { removeFromUser } from '../reducers/usersReducer'

const sortByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      return  sortByLikes([ ...state, action.payload ])
    },
    like(state, action) {
      const updatedBlog = action.payload
      return sortByLikes(state.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    },
    setBlogs(state, action) {
      return sortByLikes(action.payload)
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
    createComment(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    },
  },
})

export const { createBlog, like, setBlogs, removeBlog, createComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const generateBlog = (content, user) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(createBlog({ ...newBlog, user: user }))
      dispatch(addToUser(newBlog, user))
      dispatch(setNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`, false, 2))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }
}

export const updateLikes = (blog, user) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.update(blog)
      dispatch(like({ ...updatedBlog, user: user }))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }
}

export const deleteBlog = (blog, user) => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(removeFromUser(blog, user))
      dispatch(setNotification(`A blog ${blog.title} by ${blog.author} was deleted`, false, 2))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }
}

export const generateComment = (blog, comment) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.createComment(blog.id, { 'comment': comment })
      dispatch(createComment({ ...updatedBlog, user: blog.user }))
    } catch(exception) {
      dispatch(setNotification(`${exception.response.data.error}`, true, 2))
    }
  }
}

export default blogSlice.reducer