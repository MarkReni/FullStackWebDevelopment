import { useNotificationContent } from '../NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: useNotificationContent().visible ? '' : 'none'
  }

  const content = useNotificationContent()

  return (
    <div style={style}>
      {content.notification}
    </div>
  )
}

export default Notification
