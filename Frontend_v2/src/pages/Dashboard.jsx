import { useAuth } from '../auth/AuthProvider';
import { Box, Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import StudentList from '../components/StudentList';
import TeacherList from '../components/TeacherList';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AddStudentModal from '../components/AddStudentModal';
import AddTeacherModal from '../components/AddTeacherModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('students'); 
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate(); 

  const handleAddClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    logout();             
    navigate('/');  
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Welcome, Admin</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar setView={setView} />

        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" mb={2}>
              {view === 'students' ? 'Student List' : 'Teacher List'}
            </Typography>
            <IconButton color="primary" onClick={handleAddClick}>
              <AddIcon />
            </IconButton>
          </Box>

          {view === 'students' ? <StudentList /> : <TeacherList />}

          {/* Conditionally render modals */}
          {view === 'students' ? (
            <AddStudentModal open={openModal} onClose={handleCloseModal} />
          ) : (
            <AddTeacherModal open={openModal} onClose={handleCloseModal} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
