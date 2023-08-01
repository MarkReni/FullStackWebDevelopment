import { useSelector } from 'react-redux'

const Notification = () => {
  const { notification, visible } = useSelector(({ notification }) => notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: visible ? '' : 'none'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification