import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "../api/axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("reset-password-link/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box sx={{ width: 300, margin: "auto", mt: 10 }}>
      <Typography variant="h5">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>
          Send Reset Link
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
