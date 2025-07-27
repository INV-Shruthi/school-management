// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  MenuItem,
  Box,
  Grid,
  Typography,
  Paper,
} from '@mui/material';

const roles = ['student', 'teacher', 'dropout'];

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    admission_date: '',
    subject_specialization: '',
    employee_id: '',
    student_class: '',
    phone_number: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await onSubmit(formData);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper elevation={4} sx={{ padding: 4, width: '100%', maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create a New Account
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Role"
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            {/* Show teacher-specific fields */}
            {formData.role === 'teacher' && (
              <>
                <TextField
                  label="Employee ID"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Subject Specialization"
                  name="subject_specialization"
                  value={formData.subject_specialization}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Show student-specific fields */}
            {formData.role === 'student' && (
              <>
                <TextField
                  label="Class"
                  name="student_class"
                  value={formData.student_class}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Admission Date"
                  name="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RegisterForm;
