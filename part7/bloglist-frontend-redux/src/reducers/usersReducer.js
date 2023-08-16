import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    updateAddUsers(state, action) {
      const username = action.payload.user.username
      const userToAdd = state.find(user => user.username === username)
      const blogs = userToAdd.blogs.concat(action.payload.content)
      const addedToUser = { ...userToAdd, blogs }
      return state.map(user => user.username !== username ? user : addedToUser)
    },
    updateRemoveUsers(state, action) {
      const username = action.payload.user.username
      const userToRemove = state.find(user => user.username === username)
      const blogs = userToRemove.blogs.filter(blog => blog.id !== action.payload.content.id)
      //console.log(JSON.parse(JSON.stringify(userToRemove.blogs)))
      const removedFromUser = { ...userToRemove, blogs }
      return state.map(user => user.username !== username ? user : removedFromUser)
    }
  },
})

export const { setUsers, updateAddUsers, updateRemoveUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const addToUser = (content, user) => {
  return async dispatch => {
    dispatch(updateAddUsers({ content, user }))
  }
}

export const removeFromUser = (content, user) => {
  return async dispatch => {
    dispatch(updateRemoveUsers({ content, user }))
  }
}

export default usersSlice.reducer