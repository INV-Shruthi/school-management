import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert
} from '@mui/material';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('http://127.0.0.1:8000/api/reset-password-link/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Reset email sent successfully! Please check your inbox.');
      setEmail('');
    } else {
      setError(data.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Forgot Password
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Send Reset Link
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordForm;
