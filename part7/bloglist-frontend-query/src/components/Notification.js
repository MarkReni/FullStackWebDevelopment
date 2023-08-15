import { useNotificationContent } from '../NotificationContext'

const Notification = () => {
  const { notification, errorOn } = useNotificationContent()

  if(notification === null) {
    return null
  }

  if(errorOn) {
    return (
      <div className='errorMessage'>
        {notification}
      </div>
    )
  } else {
    return (
      <div className='message'>
        {notification}
      </div>
    )
  }
}

export default Notification