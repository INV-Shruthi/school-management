import { useAuth } from '../auth/AuthProvider';
import axios from '../api/axiosInstance';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import StudentList from '../components/StudentList';
import TeacherList from '../components/TeacherList';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudentModal from '../components/AddStudentModal';
import AddTeacherModal from '../components/AddTeacherModal';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function Dashboard() {
  const {  logout } = useAuth();
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('import/students/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`${res.data.message}\nErrors: ${res.data.errors.join("\n")}`);
    } catch (err) {
      alert("Failed to import CSV");
      console.error(err.response?.data || err.message);
    }
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

        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          {/* Title */}
          <Typography variant="h4" mb={2}>
            {view === 'students' ? 'Student List' : 'Teacher List'}
          </Typography>

          {/* List */}
          <Box sx={{ flexGrow: 1 }}>
            {view === 'students' ? <StudentList /> : <TeacherList />}
          </Box>

          {/* Bottom Actions */}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2
            }}
          >
            {view === 'students' && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ textTransform: 'none' }}
              >
                Import CSV
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </Button>
            )}

            <IconButton color="primary" onClick={handleAddClick}>
              <AddIcon />
            </IconButton>
          </Box>

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
