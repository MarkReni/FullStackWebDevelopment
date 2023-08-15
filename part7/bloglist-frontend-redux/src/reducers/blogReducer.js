import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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
    }
  },
})

export const { createBlog, like, setBlogs, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const generateBlog = (content, user) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(createBlog({ ...newBlog, user: user }))
  }
}

export const updateLikes = (blog, user) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog)
    dispatch(like({ ...updatedBlog, user: user }))
  }
}

export const deleteBlog = (blogId) => {
  return async dispatch => {
    await blogService.remove(blogId)
    dispatch(removeBlog(blogId))
  }
}

export default blogSlice.reducer