import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import {
  loginRequest,
  loginReset,
  selectLoginLoading,
  selectLoginError,
  selectLoginSuccess,
} from '../containers/Login/loginIndex';
import { LoginFormData } from '../containers/Login/loginTypes';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const success = useSelector(selectLoginSuccess);

  useEffect(() => {
    // Reset login state when component unmounts
    return () => {
      dispatch(loginReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/dashboard');
    }
  }, [success, navigate]);

  const handleLogin = (formData: LoginFormData) => {
    dispatch(loginRequest(formData));
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} error={error} />;
};

export default LoginPage; 