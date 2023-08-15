import { createContext, useReducer, useContext } from 'react'

const initialState = {
  notification: null,
  errorOn: false
}

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'DISPLAY':
    return { notification: action.payload.notification, errorOn: action.payload.errorOn }
  case 'CLEAR':
    return { notification: null, errorOn: false }
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialState)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContent = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  return notifyAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  return notifyAndDispatch[1]
}

export default NotificationContext
