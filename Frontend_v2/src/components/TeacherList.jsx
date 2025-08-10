import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTeachers = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/teachers/?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachers(res.data.results);
      setCount(Math.ceil(res.data.count / 5));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error(
        "Error fetching teachers:",
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
        "http://127.0.0.1:8000/api/teachers/export_teachers_csv/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teachers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(
        "Error exporting teachers CSV:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchTeachers(1);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Teacher List
        </Typography>
        <Button variant="outlined" onClick={exportCSV}>
          Export CSV
        </Button>
      </Box>

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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No teachers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={currentPage}
          onChange={(e, page) => fetchTeachers(page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TeacherList;
