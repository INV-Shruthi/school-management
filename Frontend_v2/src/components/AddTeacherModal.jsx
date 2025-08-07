import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import axios from '../api/axiosInstance';

export default function AddTeacherModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'teacher',
    employee_id: '',
    phone_number: '',
    subject_specialization: '',
    date_of_joining: '',
    status: 'active'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('users/', formData);
      onClose();
    } catch (err) {
      alert('Failed to add teacher');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Teacher</DialogTitle>
      <DialogContent>
        {['username', 'email', 'password', 'first_name', 'last_name', 'employee_id', 'phone_number', 'subject_specialization', 'date_of_joining'].map(field => (
          <TextField
            key={field}
            label={field.replace(/_/g, ' ').toUpperCase()}
            name={field}
            type={field.includes('date') ? 'date' : 'text'}
            value={formData[field]}
            onChange={handleChange}
            margin="dense"
            fullWidth
            InputLabelProps={field.includes('date') ? { shrink: true } : {}}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
