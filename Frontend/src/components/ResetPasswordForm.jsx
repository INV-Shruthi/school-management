import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // gets token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch(`http://127.0.0.1:8000/api/reset-password/${token}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(data.message);
      setTimeout(() => {
        navigate('/'); // Redirect to login page
      }, 2000); // wait for 2 seconds before redirect
    } else {
      setError(data.error || 'Something went wrong.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Reset Your Password
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPasswordForm;
