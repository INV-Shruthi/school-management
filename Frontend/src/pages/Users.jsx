import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/userSlice"; 
import AddUserForm from "../components/AddUserForm";

function Users() {
  const dispatch = useDispatch();
  const [openUsers, setOpenUsers] = useState(false);

   const { data, page, total, rowsPerPage } = useSelector(
    (state) => state.users
  );



  console.log("data", data)

  useEffect(() => {
    dispatch(fetchUsers({ page: 1 }));
  }, [dispatch]);

  const handleChangePage = (_, newPage) => {
    dispatch(fetchUsers({ page: newPage + 1 }));
  };
/**
 * 
 * 
 * 
 */
  return (
    <div>
      <h2>Users</h2>

      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: "10px" }}
        onClick={() => setOpenUsers(true)}
      >
        Register User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full name</TableCell>
              {/* <TableCell>Role</TableCell> */}
              <TableCell>Email Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                {/* <TableCell>{user.role}</TableCell> */}
                <TableCell>{user.email}</TableCell>
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

      <AddUserForm open={openUsers} onClose={() => setOpenUsers(false)} />
    </div>
  );
}

export default Users;
