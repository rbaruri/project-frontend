import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import { 
  loginRequest, 
  loginReset, 
  selectLoginLoading, 
  selectLoginError, 
  selectLoginSuccess,
  selectLoginData
} from '../containers/Login/loginIndex';
import { LoginFormData } from '../types/loginTypes';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const success = useSelector(selectLoginSuccess);
  const loginData = useSelector(selectLoginData);

  const from = (location.state as { from?: string })?.from || '/dashboard';

  useEffect(() => {
    // Reset login state when component unmounts
    return () => {
      dispatch(loginReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && loginData?.user) {
      login(loginData.user);
      navigate(from, { replace: true });
    }
  }, [success, loginData, login, navigate, from]);

  const handleLogin = (formData: LoginFormData) => {
    dispatch(loginRequest(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
};

export default LoginPage;