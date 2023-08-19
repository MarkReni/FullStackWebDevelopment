import PropTypes from 'prop-types'
import { Typography, TextField, Button } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <Typography variant='h5' sx={{ paddingTop: '20px' }}>Log in to application</Typography>
      <div>
        <TextField variant="outlined" size="small"
          label='username'
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField variant="outlined" size="small"
          label='password'
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" type="submit" id='login-button'>
        login
      </Button>
    </div>
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm