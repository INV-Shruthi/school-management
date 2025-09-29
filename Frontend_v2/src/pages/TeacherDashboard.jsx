import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

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
  const [submissions, setSubmissions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [submissionPage, setSubmissionPage] = useState(0);
  const [submissionRowsPerPage, setSubmissionRowsPerPage] = useState(5);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("/teachers/").then((res) => {
      if (res.data.results?.length) {
        setTeacherProfile(res.data.results[0]);
      }
    });
  }, []);

  const fetchStudents = () => {
    axios
      .get(`/students/?page=${page + 1}&page_size=${rowsPerPage}`)
      .then((res) => {
        setStudents(res.data.results || []);
        setStudentCount(res.data.count || 0);
      });
  };

  const fetchSubmissions = () => {
    axios
      .get(
        `/student-exams/?page=${submissionPage + 1}&page_size=${submissionRowsPerPage}`
      )
      .then((res) => {
        setSubmissions(res.data.results || []);
        setSubmissionCount(res.data.count || 0);
      });
  };

  const fetchAllSubmissionsForChart = async () => {
    try {
      let url = "/student-exams/?page=1&page_size=100"; 
      let allResults = [];
      let nextUrl = url;

      while (nextUrl) {
        const res = await axios.get(nextUrl);
        allResults = [...allResults, ...(res.data.results || [])];
        nextUrl = res.data.next ? res.data.next.replace(/^http:\/\/localhost:8000\/api/, "") : null;
      }

      const examMap = {};
      allResults.forEach((sub) => {
        if (!examMap[sub.exam_title]) {
          examMap[sub.exam_title] = { total: 0, count: 0 };
        }
        if (sub.score !== null && sub.score !== undefined) {
          examMap[sub.exam_title].total += sub.score;
          examMap[sub.exam_title].count += 1;
        }
      });

      const formatted = Object.entries(examMap).map(([title, data]) => ({
        exam: title,
        avgScore: (data.total / data.count).toFixed(2)
      }));
      setChartData(formatted);
    } catch (err) {
      console.error("Failed to fetch all submissions for chart", err);
    }
  };

  useEffect(() => {
    if (view === "students") {
      fetchStudents();
    }
    if (view === "submissions") {
      fetchSubmissions();
    }
    if (view === "profile") {
      fetchAllSubmissionsForChart();
    }
  }, [view, page, rowsPerPage, submissionPage, submissionRowsPerPage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Exam Handlers
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
      fetchAllSubmissionsForChart();
    } catch {
      alert("Failed to create exam");
    }
  };

  // Grading
  const handleGrade = async (id, score, remarks) => {
    try {
      await axios.patch(`/student-exams/${id}/`, { score, remarks });
      alert("Score updated!");
      fetchSubmissions();
      fetchAllSubmissionsForChart();
    } catch {
      alert("Failed to update score");
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
          <ListItemButton
            selected={view === "profile"}
            onClick={() => setView("profile")}
          >
            <ListItemText primary="My Profile" />
          </ListItemButton>

          <ListItemButton
            selected={view === "students"}
            onClick={() => setView("students")}
          >
            <ListItemText primary="Assigned Students" />
          </ListItemButton>

          <ListItemButton
            selected={view === "createExam"}
            onClick={() => setView("createExam")}
          >
            <ListItemText primary="Create Exam" />
          </ListItemButton>

          <ListItemButton
            selected={view === "submissions"}
            onClick={() => setView("submissions")}
          >
            <ListItemText primary="Student Submissions" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {view === "profile" && teacherProfile && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
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
            <Box>
              <Typography variant="h5" gutterBottom>
                Exam Performance
              </Typography>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" interval={0} tick={{ fontSize: 12, angle: -15, textAnchor: 'end' }}/>
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No exam data yet</Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Students */}
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

        {/* Create Exam */}
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

        {/* Submissions with Pagination */}
        {view === "submissions" && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Student Submissions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Exam</TableCell>
                    <TableCell>Answers</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        {students.find((s) => s.id === sub.student)?.student_name ||
                          "Unknown"}
                      </TableCell>
                      <TableCell>{sub.exam_title}</TableCell>
                      <TableCell>
                        {sub.answers.map((ans, idx) => (
                          <div key={idx} style={{ marginBottom: "8px" }}>
                            <strong>Q:</strong> {ans.question_text} <br />
                            <strong>A:</strong> {ans.answer_text}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          defaultValue={sub.score || ""}
                          onChange={(e) => (sub.score = e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          defaultValue={sub.remarks || ""}
                          onChange={(e) => (sub.remarks = e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleGrade(sub.id, sub.score, sub.remarks)
                          }
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={submissionCount}
                page={submissionPage}
                onPageChange={(e, newPage) => setSubmissionPage(newPage)}
                rowsPerPage={submissionRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setSubmissionRowsPerPage(parseInt(e.target.value, 10));
                  setSubmissionPage(0);
                }}
              />
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
