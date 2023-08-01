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
export default notificationSlice.reducer