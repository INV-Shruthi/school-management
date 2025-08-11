import { List, ListItemButton, ListItemText, Box } from '@mui/material';

export default function Sidebar({ setView }) {
  return (
    <Box sx={{ width: 200, bgcolor: '#f4f4f4', height: '100%' }}>
      <List>
        <ListItemButton onClick={() => setView('students')}>
          <ListItemText primary="Student List" />
        </ListItemButton>
        <ListItemButton onClick={() => setView('teachers')}>
          <ListItemText primary="Teacher List" />
        </ListItemButton>
      </List>
    </Box>
  );
}
