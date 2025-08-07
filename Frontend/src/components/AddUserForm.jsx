// src/components/AddUserForm.jsx
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";

export default function AddUserForm({ open, onClose }) {

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "student",
    },
  });

   const onSubmit = async (data) => {
    try {
      const stringedToken = localStorage.getItem("authTokens");
      const authToken = JSON.parse(stringedToken);
      const payload = {
        ...data,
        password:"Pass@123", // this is set as default password 
        role: "teacher",
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Users added:", response.data);
      reset();
      onClose();
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Register User</DialogTitle>
      <DialogContent dividers>
        <form id="add-user-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="first_name"
            control={control}
            rules={{ required: "first name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="last_name"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Enter a valid email",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select {...field}>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="add-user-form" variant="contained">
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
