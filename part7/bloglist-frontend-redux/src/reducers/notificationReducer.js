import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notification: null,
    errorOn: false
  },
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    deleteNotification(state, action) {
      return action.payload
    },
  },
})

export const { createNotification, deleteNotification } = notificationSlice.actions

export const setNotification = (content, isError, seconds) => {
  return async dispatch => {
    dispatch(createNotification({
      notification: content,
      errorOn: isError
    }))
    setTimeout(() => {
      dispatch(deleteNotification({
        notification: null,
        errorOn: false
      }))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer