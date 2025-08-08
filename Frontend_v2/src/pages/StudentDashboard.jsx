// src/pages/StudentDashboard.jsx
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
  Paper,
  ListItemButton,
  TextField
} from "@mui/material";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState("profile");
  const [profile, setProfile] = useState({});
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState({});
  const [examStatus, setExamStatus] = useState(null); // finished exam details

  // Fetch profile once
  useEffect(() => {
    axios.get("students/").then((res) => {
      if (res.data.results && res.data.results.length > 0) {
        setProfile(res.data.results[0]);
      }
    });
  }, []);

  // Fetch exams when view is "exams"
  useEffect(() => {
    if (view === "exams") {
      axios.get("exams/").then((res) => {
        setExams(res.data.results || res.data);
      });
    }
  }, [view]);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Handle exam selection
  const handleExamClick = async (exam) => {
    setSelectedExam(exam);
    setExamStatus(null);
    setQuestions([]);
    setExamAnswers({});

    try {
      // Fetch exam details including questions
      const examDetail = await axios.get(`student-exams/${student-exam.id}/`);
      setQuestions(examDetail.data.questions || []);

      // Check if this student already attempted this exam
      const res = await axios.get(`student-exams/?exam=${student-exam.id}`);
      if (res.data.results && res.data.results.length > 0) {
        setExamStatus(res.data.results[0]); // already finished
      } else {
        // Prepare empty answers
        const ansObj = {};
        (examDetail.data.questions || []).forEach((q) => {
          ansObj[q.id] = "";
        });
        setExamAnswers(ansObj);
      }
    } catch (err) {
      console.error("Error fetching exam:", err.response?.data || err);
    }
  };

  // Handle answer typing
  const handleAnswerChange = (questionId, value) => {
    setExamAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Submit exam
  const handleSubmitExam = async () => {
    try {
      const payload = {
        exam: selectedExam.id,
        student: profile.id, // Must be student table ID
        answers: Object.entries(examAnswers).map(([qId, text]) => ({
          question: parseInt(qId),
          answer_text: text
        }))
      };

      console.log("Submitting exam payload:", payload);

      await axios.post("student-exams/", payload);
      alert("Exam submitted successfully!");

      // Reload exams view
      setSelectedExam(null);
      setView("exams");
    } catch (err) {
      console.error("Exam submission failed:", err.response?.data || err);
      alert("Failed to submit exam");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Welcome, {profile.student_name}
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
            disablePadding
            selected={view === "profile"}
            onClick={() => {
              setSelectedExam(null);
              setView("profile");
            }}
          >
            <ListItemButton>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            selected={view === "exams"}
            onClick={() => {
              setSelectedExam(null);
              setView("exams");
            }}
          >
            <ListItemButton>
              <ListItemText primary="Exams" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {/* Profile View */}
        {view === "profile" && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Student Profile
            </Typography>
            <p><b>Name:</b> {profile.student_name}</p>
            <p><b>Roll Number:</b> {profile.roll_number}</p>
            <p><b>Class:</b> {profile.student_class}</p>
            <p><b>Phone:</b> {profile.phone_number}</p>
            <p><b>Date of Birth:</b> {profile.date_of_birth}</p>
            <p><b>Admission Date:</b> {profile.admission_date}</p>
            <p><b>Status:</b> {profile.status}</p>
            <p><b>Assigned Teacher:</b> {profile.assigned_teacher_name}</p>
          </Box>
        )}

        {/* Exams List */}
        {view === "exams" && !selectedExam && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Available Exams
            </Typography>
            <List component={Paper}>
              {exams.map((exam) => (
                <ListItemButton key={exam.id} onClick={() => handleExamClick(exam)}>
                  <ListItemText primary={exam.title} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {/* Exam Detail */}
        {view === "exams" && selectedExam && (
          <Box>
            <Typography variant="h5" gutterBottom>
              {selectedExam.title}
            </Typography>

            {/* If already finished */}
            {examStatus ? (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Exam Finished
                </Typography>
                <p>
                  <b>Score:</b> {examStatus.score}
                </p>
                <p>
                  <b>Remarks:</b> {examStatus.remarks}
                </p>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Your Answers
                </Typography>
                {examStatus.answers.map((a, i) => (
                  <Paper key={i} sx={{ p: 1, my: 1 }}>
                    <p>
                      <b>Question:</b> {questions.find((q) => q.id === a.question)?.text}
                    </p>
                    <p>
                      <b>Your Answer:</b> {a.answer_text}
                    </p>
                  </Paper>
                ))}
              </Paper>
            ) : (
              /* If not finished */
              <Box>
                {questions.map((q) => (
                  <Paper key={q.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1">{q.text}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      value={examAnswers[q.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(q.id, e.target.value)
                      }
                    />
                  </Paper>
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitExam}
                >
                  Submit Exam
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
