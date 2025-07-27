import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const CreateExam = ({ onExamCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onExamCreated({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6">Create Exam</Typography>
      <Box component="form" onSubmit={handleSubmit} mt={2}>
        <TextField
          fullWidth label="Exam Title" value={title}
          onChange={(e) => setTitle(e.target.value)} margin="normal" required
        />
        <TextField
          fullWidth label="Description" multiline rows={3}
          value={description} onChange={(e) => setDescription(e.target.value)} margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Exam</Button>
      </Box>
    </Paper>
  );
};

export default CreateExam;
