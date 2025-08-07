// src/pages/TeacherDashboard.jsx

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from '../api/axiosInstance';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState({});
  const [view, setView] = useState('students'); // or 'profile'

  useEffect(() => {
    axios.get('teacher/students/').then(res => setStudents(res.data.results));
    axios.get('teacher/profile/').then(res => setTeacherProfile(res.data));
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 200, backgroundColor: '#eee', p: 2 }}>
        <Typography onClick={() => setView('students')} sx={{ cursor: 'pointer', mb: 1 }}>Assigned Students</Typography>
        <Typography onClick={() => setView('profile')} sx={{ cursor: 'pointer' }}>My Profile</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {view === 'students' && (
          <>
            <Typography variant="h5">Assigned Students</Typography>
            <ul>
              {students.map(s => (
                <li key={s.id}>{s.first_name} {s.last_name} - {s.class_name}</li>
              ))}
            </ul>
          </>
        )}
        {view === 'profile' && (
          <>
            <Typography variant="h5">My Profile</Typography>
            <p><b>Name:</b> {teacherProfile.first_name} {teacherProfile.last_name}</p>
            <p><b>Email:</b> {teacherProfile.email}</p>
            <p><b>Subject:</b> {teacherProfile.subject_specialization}</p>
          </>
        )}
      </Box>
    </Box>
  );
}
