import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const { notification, errorOn } = useSelector(({ notification }) => notification)

  if(notification === null) {
    return null
  }

  if(errorOn) {
    return (
      <Alert severity='error'>
        {notification}
      </Alert>
    )
  } else {
    return (
      <Alert severity='success'>
        {notification}
      </Alert>
    )
  }
}

export default Notification