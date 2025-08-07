// src/pages/StudentDashboard.jsx

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from '../api/axiosInstance';

export default function StudentDashboard() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axios.get('student/profile/').then(res => setProfile(res.data));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Student Profile</Typography>
      <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Class:</b> {profile.class_name}</p>
      <p><b>Roll Number:</b> {profile.roll_number}</p>
    </Box>
  );
}
