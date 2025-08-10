import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); 

  const fetchStudents = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/students/?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 5)); // Assuming 5 rows per page
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error(
        "Error fetching students:",
        err.response?.data || err.message
      );
    }
  };

  const exportCSV = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/students/export_students_csv/",
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
          Student List
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
    </Box>
  );
};

export default StudentList;
