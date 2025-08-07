import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from '../api/axiosInstance';
import { useAuth } from '../auth/AuthProvider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('token/', { username, password });  // Use username
    login(res.data);
    const userRole = res.data.role;

    // if (userRole === 'admin') navigate('/dashboard');
    // else if (userRole === 'teacher') navigate('/teacher-dashboard');
    // else if (userRole === 'student') navigate('/student-dashboard');

    if (userRole === 'teacher') navigate('/teacher-dashboard');
    else if (userRole === 'student') navigate('/student-dashboard');
    else  navigate('/dashboard');

  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <Box sx={{ width: 300, margin: 'auto', marginTop: 20 }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
}


