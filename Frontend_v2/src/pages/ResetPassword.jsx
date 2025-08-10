import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "../api/axiosInstance";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`reset-password/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box sx={{ width: 300, margin: "auto", mt: 10 }}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>
          Reset Password
        </Button>
      </form>
      {message && (
        <Typography sx={{ mt: 2 }} color="secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
