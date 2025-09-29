import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("access_token");

  const fetchTeachers = async (pageNumber = 1, searchQuery = "") => {
    try {
      const res = await axios.get("teachers/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNumber, search: searchQuery || undefined },
      });
      setTeachers(res.data.results);
      setCount(Math.ceil(res.data.count / 5));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Error fetching teachers:", err.response?.data || err.message);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get("teachers/export_teachers_csv/", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teachers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting teachers CSV:", err.response?.data || err.message);
    }
  };

  const handleEditOpen = (teacher) => {
    setEditData({ ...teacher });
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
      await axios.put(`teachers/${editData.id}/`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleEditClose();
      fetchTeachers(currentPage, search);
    } catch (err) {
      console.error("Error updating teacher:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`teachers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeachers(currentPage, search);
    } catch (err) {
      console.error("Error deleting teacher:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTeachers(1);
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search Teachers"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchTeachers(1, e.target.value);
            }}
          />
        </Stack>
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
              <TableCell><b>Employee ID</b></TableCell>
              <TableCell><b>Subject</b></TableCell>
              <TableCell><b>Joining Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell>{teacher.full_name}</TableCell>
                  <TableCell>{teacher.employee_id}</TableCell>
                  <TableCell>{teacher.subject_specialization}</TableCell>
                  <TableCell>{teacher.date_of_joining}</TableCell>
                  <TableCell>{teacher.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(teacher)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(teacher.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No teachers found
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
          onChange={(e, page) => fetchTeachers(page, search)}
          color="primary"
        />
      </Box>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            name="employee_id"
            label="Employee ID"
            value={editData.employee_id || ""}
            onChange={handleEditChange}
          />
          <TextField
            name="subject_specialization"
            label="Subject Specialization"
            value={editData.subject_specialization || ""}
            onChange={handleEditChange}
          />
          <TextField
            name="date_of_joining"
            label="Date of Joining"
            type="date"
            value={editData.date_of_joining || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            name="status"
            label="Status"
            value={editData.status || ""}
            onChange={handleEditChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
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

export default TeacherList;
