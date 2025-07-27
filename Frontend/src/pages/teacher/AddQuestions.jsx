import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const AddQuestions = ({ onQuestionAdded, examId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAddQuestion = (e) => {
    e.preventDefault();
    onQuestionAdded({ examId, question, answer });
    setQuestion('');
    setAnswer('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6">Add Questions</Typography>
      <Box component="form" onSubmit={handleAddQuestion} mt={2}>
        <TextField
          fullWidth label="Question" value={question}
          onChange={(e) => setQuestion(e.target.value)} margin="normal" required
        />
        <TextField
          fullWidth label="Correct Answer" value={answer}
          onChange={(e) => setAnswer(e.target.value)} margin="normal" required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Question</Button>
      </Box>
    </Paper>
  );
};

export default AddQuestions;
