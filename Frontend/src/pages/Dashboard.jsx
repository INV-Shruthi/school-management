import Layout from "../components/Layout";
import { Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="body1">
        Use the sidebar to navigate between Students and Teachers.
      </Typography>
    </Layout>
  );
}
