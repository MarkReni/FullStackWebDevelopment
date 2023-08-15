import { useSelector } from 'react-redux'

const Notification = () => {
  const { notification, errorOn } = useSelector(({ notification }) => notification)

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