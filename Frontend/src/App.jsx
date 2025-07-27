// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useAuth } from "./context/AuthContext";
import ResetPasswordPage from "./pages/ResetPasswordPage"; // ✅ Make sure you have this page
// import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Users from "./pages/Users";
import withRole from "./utils/withRole";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const StudentsWithRole = withRole({ roles: ["admin", "teacher"] })(Students);
  const TeachersWithRole = withRole({ roles: ["admin"] })(Teachers);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
            <Dashboard />
          // </ProtectedRoute>
        }
      >
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="users" element={<Users/>}/>
      </Route>
    </Routes>
  );
}

export default App;
