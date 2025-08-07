import { Box, Button } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';

export default function Sidebar({ setView }) {
  const { logout } = useAuth();

  return (
    <Box sx={{ width: 200, bgcolor: '#f4f4f4', p: 2, height: '100vh' }}>
      <Button fullWidth onClick={() => setView('students')}>Students</Button>
      <Button fullWidth onClick={() => setView('teachers')}>Teachers</Button>
      <Button fullWidth color="error" onClick={logout}>Logout</Button>
    </Box>
  );
}
