import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { selectLoginLoading, selectLoginError, selectLoginSuccess } from '@/containers/Login/loginSelectors';
import { loginRequest } from '@/containers/Login/loginActions';
import { LoginFormData } from '@/containers/Login/loginConstants';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const success = useSelector(selectLoginSuccess);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 800); // Keep the same delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = (formData: LoginFormData) => {
    dispatch(loginRequest(formData));
  };

  return (
    <div className="fixed inset-0 top-16 flex items-center justify-center bg-white">
      <LoginForm 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;