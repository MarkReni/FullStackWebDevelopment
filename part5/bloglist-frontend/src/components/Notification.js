const Notification = ({ message, errorOn }) => {
  if(message === null) {
    return null
  }

  if(errorOn) {
    return (
      <div className='errorMessage'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='message'>
        {message}
      </div>
    )
  }
}

export default Notification