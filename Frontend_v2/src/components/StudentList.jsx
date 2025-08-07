import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from '@mui/material';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  const fetchStudents = async (pageNumber = 0) => {
    try {
    //   const token = localStorage.getItem('token');
      const res = await axios.get(`http://127.0.0.1:8000/api/students/?page=${pageNumber}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 5)); // Assuming 5 per page
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  return (
    <Box>
      <h2>Student List</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>DOB</TableCell>
              {/* Add other headers */}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.first_name} {student.last_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.class_name}</TableCell>
                <TableCell>{student.date_of_birth}</TableCell>
                {/* Add other fields */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={count} page={page} onChange={(e, value) => setPage(value)} />
      </Box>
    </Box>
  );
};

export default StudentList;
