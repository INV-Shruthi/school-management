// src/pages/ResetPasswordPage.jsx
import { useParams } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {
  const { token } = useParams();
  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
