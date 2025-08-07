import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import axios from '../api/axiosInstance';

export default function AddStudentModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    roll_number: '',
    phone_number: '',
    student_class: '',
    date_of_birth: '',
    admission_date: '',
    status: 'active',
    assigned_teacher: '',
  });

  const [teachers, setTeachers] = useState([]);

    useEffect(() => {
    axios.get('teachers/')
        .then((res) => {
        console.log("Teacher API Response:", res.data);
        setTeachers(res.data.results);
        })
        .catch((error) => {
        console.error("Error fetching teachers:", error);
        });
    }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('users/', formData);
      onClose();
    } catch (err) {
      alert('Failed to add student');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        {['username', 'email', 'password', 'first_name', 'last_name', 'roll_number', 'phone_number', 'student_class', 'date_of_birth', 'admission_date'].map(field => (
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
        <TextField
          select
          label="Assigned Teacher"
          name="assigned_teacher"
          value={formData.assigned_teacher}
          onChange={handleChange}
          margin="dense"
          fullWidth
        >
          {teachers.map(t => (
            <MenuItem key={t.id} value={t.id}>
              {t.full_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
