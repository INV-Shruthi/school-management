// src/pages/ForgotPasswordPage.jsx
import axios from 'axios';
import ForgotPasswordForm from '../components/ForgotpasswordForm';

const ForgotPasswordPage = () => {
  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password-link/', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Something went wrong' };
    }
  };

  return <ForgotPasswordForm onSubmit={handleForgotPassword} />;
};

export default ForgotPasswordPage;
