// src/pages/TeachersPage.jsx
import React, { useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../features/teacherSlice";
import withRole from "../utils/withRole";

function Teachers() {
  const dispatch = useDispatch();
  const { data, page, total, rowsPerPage } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(fetchTeachers({ page: 1 }));
  }, [dispatch]);

  const handleChangePage = (_, newPage) => {
    dispatch(fetchTeachers({ page: newPage + 1 }));
  };

  return (
    <div>
      <h2>Teachers</h2>

      {/* Only admin can see this */}
      <AdminRegisterButton />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.employee_id}</TableCell>
                <TableCell>{teacher.full_name}</TableCell>
                <TableCell>{teacher.subject_specialization}</TableCell>
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

const AdminRegisterButton = withRole(["admin"])(() => (
  <Button variant="contained" color="secondary" style={{ marginBottom: "10px" }}>
    Register Teacher
  </Button>
));

export default Teachers;
