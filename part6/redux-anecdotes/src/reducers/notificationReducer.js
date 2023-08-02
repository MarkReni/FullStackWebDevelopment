import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notification: '',
    visible: false
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

export const setNotification = (content, seconds) => {
  return async dispatch => {
    dispatch(createNotification({
      notification: content,
      visible: true
    }))
    setTimeout(() => {
      dispatch(deleteNotification({
        notification: '',  // can be deleted
        visible: false  // can be deleted
      }))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer