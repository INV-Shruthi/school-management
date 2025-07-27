// src/pages/StudentsPage.jsx
import React, { useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../features/studentSlice";
import withRole from "../utils/withRole";
function Students() {
  const dispatch = useDispatch();
  const { data, page, total, rowsPerPage } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents({ page: 1 }));
  }, [dispatch]);

  const handleChangePage = (_, newPage) => {
    dispatch(fetchStudents({ page: newPage + 1 }));
  };

  return (
    <div>
      <h2>Students</h2>

      {/* Only teachers can see this button */}
      <TeacherRegisterButton />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.roll_number}</TableCell>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{student.student_class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      </TableContainer>
    </div>
  );
}

const TeacherRegisterButton = withRole(["teacher"])(() => (
  <Button variant="contained" color="primary" style={{ marginBottom: "10px" }}>
    Register Student
  </Button>
));

export default Students;
