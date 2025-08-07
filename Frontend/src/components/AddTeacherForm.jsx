import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

export default function AddTeacherForm({ open, onClose }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      employee_id: "",
      subject_specialization: "",
      date_of_joining: "",
      status: "active",
    },
  });

  const onSubmit = async (data) => {
    try {
      const stringedToken = localStorage.getItem("authTokens");
      const authToken = JSON.parse(stringedToken);
      const payload = {
        ...data,
        role: "teacher",
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/teachers/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Teacher added:", response.data);
      reset();
      onClose();
    } catch (error) {
      console.error(
        "Error adding teacher:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Teacher</DialogTitle>
      <DialogContent dividers>
        <form id="teacher-form" onSubmit={handleSubmit(onSubmit)}>
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
            name="employee_id"
            control={control}
            rules={{ required: "Employee ID is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Employee ID"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="subject_specialization"
            control={control}
            rules={{ required: "Subject specialization is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Subject Specialization"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="date_of_joining"
            control={control}
            rules={{ required: "Date of joining is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date of Joining"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select {...field}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="teacher-form" variant="contained">
          Add Teacher
        </Button>
      </DialogActions>
    </Dialog>
  );
}
