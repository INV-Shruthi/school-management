import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const ReviewSubmissions = ({ submissions, onMarkAssigned }) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6">Review Answers & Allot Marks</Typography>
      <List>
        {submissions.map((submission, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`Q: ${submission.question}`}
              secondary={`Submitted Answer: ${submission.submittedAnswer}`}
            />
            <TextField
              label="Marks" type="number" size="small"
              onChange={(e) => onMarkAssigned(index, parseInt(e.target.value))}
              sx={{ width: 100, ml: 2 }}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" sx={{ mt: 2 }}>Submit Marks</Button>
    </Paper>
  );
};

export default ReviewSubmissions;
