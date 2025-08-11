import React, { useEffect, useState } from "react";
import axios from '../api/axiosInstance';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [teachers, setTeachers] = useState([]);

  const token = localStorage.getItem("access_token");

  const fetchStudents = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `students/?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 5));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err.message);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("teachers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.results || res.data); 
    } catch (err) {
      console.error("Error fetching teachers:", err.response?.data || err.message);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get(
        "students/export_students_csv/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting students CSV:", err.response?.data || err.message);
    }
  };

  const handleEditOpen = (student) => {
    setEditData({ ...student });
    fetchTeachers();
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `students/${editData.id}/`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleEditClose();
      fetchStudents(currentPage);
    } catch (err) {
      console.error("Error updating student:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`students/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents(currentPage);
    } catch (err) {
      console.error("Error deleting student:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, []);

  return (
    <Box>
      {/* Header & Export */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {/* Students */}
        </Typography>
        <Button variant="outlined" onClick={exportCSV}>
          Export CSV
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Class</b></TableCell>
              <TableCell><b>Roll No</b></TableCell>
              <TableCell><b>Phone No</b></TableCell>
              <TableCell><b>DOB</b></TableCell>
              <TableCell><b>Admission</b></TableCell>
              <TableCell><b>Assigned Teacher</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.student_class}</TableCell>
                  <TableCell>{student.roll_number}</TableCell>
                  <TableCell>{student.phone_number}</TableCell>
                  <TableCell>{student.date_of_birth}</TableCell>
                  <TableCell>{student.admission_date}</TableCell>
                  <TableCell>{student.assigned_teacher_name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(student)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(student.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={currentPage}
          onChange={(e, page) => fetchStudents(page)}
          color="primary"
        />
      </Box>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            name="student_class"
            label="Class"
            value={editData.student_class || ""}
            onChange={handleEditChange}
          />
          <TextField
            name="roll_number"
            label="Roll Number"
            value={editData.roll_number || ""}
            onChange={handleEditChange}
          />
          <TextField
            name="phone_number"
            label="Phone Number"
            value={editData.phone_number || ""}
            onChange={handleEditChange}
          />
          <TextField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            value={editData.date_of_birth || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="admission_date"
            label="Admission Date"
            type="date"
            value={editData.admission_date || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentList;
