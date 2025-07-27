// src/pages/TeachersPage.jsx
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../features/teacherSlice";
import AddTeacherForm from "../components/AddTeacherForm";

function Teachers() {
  const dispatch = useDispatch();
  const [openTeacher, setOpenTeacher] = useState(false);

  const { data, page, total, rowsPerPage } = useSelector(
    (state) => state.teachers
  );

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
      <Button
        variant="contained"
        color="secondary"
        style={{ marginBottom: "10px" }}
        onClick={() => setOpenTeacher(true)}
      >
        Register Teacher
      </Button>

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
      <AddTeacherForm
        open={openTeacher}
        onClose={() => setOpenTeacher(false)}
      />
    </div>
  );
}

// const AdminRegisterButton = withRole(["admin"])(() => (

// ));

export default Teachers;
