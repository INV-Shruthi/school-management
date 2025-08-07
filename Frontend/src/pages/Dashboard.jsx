import { useAuth } from '../auth/AuthProvider';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
// import StudentList from '../components/StudentList';
// import TeacherList from '../components/TeacherList';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [view, setView] = useState('students');

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar setView={setView} />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" mb={2}>
          {view === 'students' ? 'Student List' : 'Teacher List'}
        </Typography>
        {view === 'students' ? <StudentList /> : <TeacherList />}
      </Box>
    </Box>
  );
}
