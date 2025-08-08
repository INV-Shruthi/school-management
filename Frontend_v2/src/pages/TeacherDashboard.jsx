// src/pages/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  IconButton
} from "@mui/material";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState("profile");
  const [teacherProfile, setTeacherProfile] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([{ text: "" }]);

  // Fetch profile
  useEffect(() => {
    axios.get("/teachers/").then((res) => {
      if (res.data.results?.length) {
        setTeacherProfile(res.data.results[0]);
      }
    });
  }, []);

  // Fetch paginated students
  const fetchStudents = () => {
    axios
      .get(`/students/?page=${page + 1}&page_size=${rowsPerPage}`)
      .then((res) => {
        setStudents(res.data.results || []);
        setStudentCount(res.data.count || 0);
      });
  };

  useEffect(() => {
    if (view === "students") {
      fetchStudents();
    }
  }, [view, page, rowsPerPage]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Exam question handlers
  const addQuestionField = () => {
    setQuestions([...questions, { text: "" }]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!teacherProfile) return;

    try {
      await axios.post("/exams/", {
        title: examTitle,
        teacher: teacherProfile.id,
        questions
      });
      alert("Exam created successfully!");
      setExamTitle("");
      setQuestions([{ text: "" }]);
    } catch {
      alert("Failed to create exam");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Welcome{teacherProfile ? `, ${teacherProfile.full_name}` : ""}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          [`& .MuiDrawer-paper`]: { width: 220, mt: 8 }
        }}
      >
        <List>
          <ListItem
            button
            selected={view === "profile"}
            onClick={() => setView("profile")}
          >
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem
            button
            selected={view === "students"}
            onClick={() => setView("students")}
          >
            <ListItemText primary="Assigned Students" />
          </ListItem>
          <ListItem
            button
            selected={view === "createExam"}
            onClick={() => setView("createExam")}
          >
            <ListItemText primary="Create Exam" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {view === "profile" && teacherProfile && (
          <Box>
            <Typography variant="h5" gutterBottom>
              My Profile
            </Typography>
            <p><b>Name:</b> {teacherProfile.full_name}</p>
            <p><b>Employee ID:</b> {teacherProfile.employee_id}</p>
            <p><b>Subject:</b> {teacherProfile.subject_specialization}</p>
            <p><b>Joining Date:</b> {teacherProfile.date_of_joining}</p>
            <p><b>Status:</b> {teacherProfile.status}</p>
          </Box>
        )}

        {view === "students" && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Assigned Students
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Admission</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.roll_number}</TableCell>
                      <TableCell>{s.student_name}</TableCell>
                      <TableCell>{s.student_class}</TableCell>
                      <TableCell>{s.phone_number}</TableCell>
                      <TableCell>{s.date_of_birth}</TableCell>
                      <TableCell>{s.admission_date}</TableCell>
                      <TableCell>{s.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={studentCount}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </TableContainer>
          </Box>
        )}

        {view === "createExam" && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create Exam
            </Typography>
            <form onSubmit={handleCreateExam}>
              <TextField
                label="Exam Title"
                fullWidth
                margin="normal"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                required
              />
              {questions.map((q, idx) => (
                <TextField
                  key={idx}
                  label={`Question ${idx + 1}`}
                  fullWidth
                  margin="normal"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  required
                />
              ))}
              <IconButton color="primary" onClick={addQuestionField}>
                +
              </IconButton>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Create Exam
              </Button>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
}
