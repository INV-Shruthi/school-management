import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const registerUser = async (formData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Optional: Delay redirect to show message
        return { success: true, message: data.message || 'Registration successful!' };
      } else {
        let errorMessage = data.message || 'Registration failed';
        if (data.errors) {
          // Collect all field errors
          const allErrors = Object.values(data.errors).flat().join(' ');
          errorMessage = allErrors;
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Register Error:', error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  return <RegisterForm onSubmit={registerUser} />;
};

export default RegisterPage;
