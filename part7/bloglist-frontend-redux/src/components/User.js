import { Typography, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'

const User = ({ user }) => {
  if(!user) {
    return null
  }

  return(
    <div>
      <Typography variant='h4'>{user.name}</Typography>
      <Typography variant='h6'>Added Blogs<Divider variant='text' style={{ backgroundColor:'primary.main' }} /></Typography>
      <List>
        {user.blogs.map(blog =>
          <ListItem  key={blog.id}>
            <ListItemIcon sx={{ minWidth: '40px', height: '44px', color: 'primary.dark' }}>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary={blog.title} />
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default User