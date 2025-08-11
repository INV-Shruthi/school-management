import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
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
      const res = await axios.post('token/', { username, password });
      login(res.data);
      const userRole = res.data.role;

      if (userRole === 'teacher') navigate('/teacher-dashboard');
      else if (userRole === 'student') navigate('/student-dashboard');
      else navigate('/dashboard');

    } catch {
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
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
          <Typography
            variant="body2"
            sx={{
              cursor: 'pointer',
              mt: 1,
              textAlign: 'right',
              color: 'primary.main',
            }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Typography>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
