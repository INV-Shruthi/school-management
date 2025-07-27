import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddStudentForm({ open, onClose }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      roll_number: "",
      dob: "",
      date_of_admission: "",
      student_class: "",
      phone_number: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const stringedToken = localStorage.getItem("authTokens");
      const authToken = JSON.parse(stringedToken);
      const payload = {
        ...data,
        role: "student",
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/students/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Student added:", response.data);
      reset();
      onClose();
    } catch (error) {
      console.error(
        "Error adding student:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent dividers>
        <form id="student-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="roll_number"
            control={control}
            rules={{ required: "Roll number is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Roll Number"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="dob"
            control={control}
            rules={{ required: "Date of birth is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date of Birth"
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
            name="date_of_admission"
            control={control}
            rules={{ required: "Date of admission is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date of Admission"
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
            name="student_class"
            control={control}
            rules={{ required: "Class is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Class"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="phone_number"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit number",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="student-form" variant="contained">
          Add Student
        </Button>
      </DialogActions>
    </Dialog>
  );
}
