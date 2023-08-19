import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material'

const Users = () => {
  const users = useSelector(({ users }) => users)

  return(
    <div>
      <Typography variant='h4'>Users</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ backgroundColor: 'primary.dark', color: 'primary.light' }}>
          <TableHead sx={{ backgroundColor: 'primary.dark' }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontSize: 22, color: 'primary.light' }}>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell sx={{ textDecoration: 'none' }} >
                  <Typography sx={{ textDecoration: 'none', fontSize: '20px', color: 'primary.light' }} component={Link} to={`/users/${user.id}`}>{user.name}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '18px', color: 'primary.light' }}>{user.blogs.length}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users