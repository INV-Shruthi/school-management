import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Paper, Box,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';


const TeacherDashboard = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [examCreated, setExamCreated] = useState(false);
  const [_, setCurrentExam] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [allExams, setAllExams] = useState([]);

  const handleCreateExam = () => {
    const newExam = {
      id: Date.now(),
      title: examTitle,
      description: examDescription,
      questions: []
    };
    setCurrentExam(newExam);
    setExamCreated(true);
  };

  const handleAddQuestion = () => {
    const updatedQuestions = [...questionList, { question: questionText, answer: answerText }];
    setQuestionList(updatedQuestions);
    setQuestionText('');
    setAnswerText('');
  };



const handleSubmitExam = async () => {
  const stringedToken = localStorage.getItem('authTokens'); 
  const authToken =  JSON.parse(stringedToken)

  if (!authToken) {
    alert('Unauthorized: Please login first');
    return;
  }

  const payload = {
    title: examTitle,
    teacher: 1,
    questions: questionList.map((q) => ({ text: q.question })),
  };

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/exams/',
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Simulate local exam object with questions and fake student submission
    const newExam = {
      id: response.data.id,
      title: response.data.title,
      description: '', // Add if API supports
      questions: questionList,
    //   studentSubmissions: [
    //     {
    //       studentName: 'John Doe',
    //       answers: questionList.map((q) => ({
    //         question: q.question,
    //         submittedAnswer: 'Student sample answer',
    //         marks: null,
    //       })),
    //     },
    //   ],
    };

    setAllExams([...allExams, newExam]);
    resetForm();
    alert('Exam submitted successfully!');
  } catch (error) {
    console.error('Exam submission failed:', error);
    alert('Error submitting exam. Check console for details.');
  }
};

  const resetForm = () => {
    setExamTitle('');
    setExamDescription('');
    setExamCreated(false);
    setCurrentExam(null);
    setQuestionList([]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Teacher Dashboard</Typography>

      {/* Create Exam */}
      {!examCreated && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Create Exam</Typography>
          <TextField
            label="Exam Title" fullWidth margin="normal"
            value={examTitle} onChange={(e) => setExamTitle(e.target.value)} required
          />
          <TextField
            label="Description" fullWidth margin="normal" multiline rows={3}
            value={examDescription} onChange={(e) => setExamDescription(e.target.value)} required
          />
          <Button
            variant="contained" sx={{ mt: 2 }}
            onClick={handleCreateExam} disabled={!examTitle || !examDescription}
          >
            Next: Add Questions
          </Button>
        </Paper>
      )}

      {/* Add Questions */}
      {examCreated && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Add Questions</Typography>
          <TextField
            label="Question" fullWidth margin="normal"
            value={questionText} onChange={(e) => setQuestionText(e.target.value)} required
          />
          <TextField
            label="Answer" fullWidth margin="normal"
            value={answerText} onChange={(e) => setAnswerText(e.target.value)} required
          />
          <Button
            variant="contained" sx={{ mt: 2, mr: 2 }}
            onClick={handleAddQuestion}
            disabled={!questionText || !answerText}
          >
            Add Question
          </Button>
          {questionList.length > 0 && (
            <Button variant="outlined" color="success" sx={{ mt: 2 }} onClick={handleSubmitExam}>
              Submit Exam ({questionList.length} Question{questionList.length > 1 ? 's' : ''})
            </Button>
          )}
        </Paper>
      )}

      {/* Submitted Exams with Accordion */}
      {allExams.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Submitted Exams</Typography>
          {allExams.map((exam, index) => (
            <Accordion key={exam.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {index + 1}. {exam.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom>
                  Description: {exam.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Questions:</Typography>
                <List dense>
                  {exam.questions.map((q, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`Q${i + 1}: ${q.question}`}
                        secondary={`Answer: ${q.answer}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default TeacherDashboard;
