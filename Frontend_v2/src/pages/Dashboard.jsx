import { useAuth } from '../auth/AuthProvider';
import axios from '../api/axiosInstance';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Paper,
  Container,
  Divider,
  Stack,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MenuIcon from '@mui/icons-material/Menu';
import StudentList from '../components/StudentList';
import TeacherList from '../components/TeacherList';
import AddStudentModal from '../components/AddStudentModal';
import AddTeacherModal from '../components/AddTeacherModal';
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const { logout } = useAuth();
  const [view, setView] = useState('dashboard');
  const [openModal, setOpenModal] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

  // Fetch teacher-student counts
  useEffect(() => {
    if (view === 'dashboard') {
      const fetchData = async () => {
        try {
          const teachersRes = await axios.get('teachers/');
          const teachers = teachersRes.data.results || teachersRes.data;
          setTeacherCount(teachers.length);

          let totalStudents = 0;
          const counts = await Promise.all(
            teachers.map(async (teacher) => {
              const studentsRes = await axios.get(`teachers/${teacher.id}/students/`);
              totalStudents += studentsRes.data.length;
              return {
                name: teacher.full_name,
                student_count: studentsRes.data.length,
              };
            })
          );

          setStudentCount(totalStudents);
          setGraphData(counts);
        } catch (err) {
          console.error(err.response?.data || err.message);
        }
      };

      fetchData();
    }
  }, [view]);

  const handleAddClick = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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

  // Menu Handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuSelect = (option) => {
    setView(option);
    setAnchorEl(null);
  };
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar */}
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            Admin Dashboard
          </Typography>

          <Box>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuSelect('dashboard')}>
                Overview
              </MenuItem>
              <MenuItem onClick={() => handleMenuSelect('students')}>
                Students
              </MenuItem>
              <MenuItem onClick={() => handleMenuSelect('teachers')}>
                Teachers
              </MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        <Typography variant="h4" gutterBottom>
          {view === 'students'
            ? 'Student Management'
            : view === 'teachers'
            ? 'Teacher Management'
            : 'Overview'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Dashboard */}
        {view === 'dashboard' && (
          <Grid container spacing={15}>
            {/* Left side - Counts */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: 150,
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { bgcolor: 'primary.light', color: 'white' },
                  }}
                  elevation={3}
                  onClick={() => setView('teachers')}
                >
                  <Typography variant="h6" gutterBottom>
                    Total Teachers
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {teacherCount}
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: 150,
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { bgcolor: 'secondary.light', color: 'white' },
                  }}
                  elevation={3}
                  onClick={() => setView('students')}
                >
                  <Typography variant="h6" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h6"></Typography>
                  <Typography variant="h3" color="secondary" fontWeight="bold">
                    {studentCount}
                  </Typography>
                </Paper>
              </Stack>
            </Grid>

            {/* Right side - Chart */}
            <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  Allocation Map
                </Typography>
                <Box sx={{ width: '300%', height: '100%' }}>
                  <ResponsiveContainer width="90%" height="90%">
                    <BarChart data={graphData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="student_count" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
            </Grid>
          </Grid>
        )}

        {/* Student / Teacher List */}
        {view === 'students' && <StudentList />}
        {view === 'teachers' && <TeacherList />}

        {view !== 'dashboard' && (
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            {view === 'students' && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
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
            <IconButton
              color="primary"
              onClick={handleAddClick}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        )}

        {/* Modals */}
        {view === 'students' && (
          <AddStudentModal open={openModal} onClose={handleCloseModal} />
        )}
        {view === 'teachers' && (
          <AddTeacherModal open={openModal} onClose={handleCloseModal} />
        )}
      </Container>
    </Box>
  );
}
