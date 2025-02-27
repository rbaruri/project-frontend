import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { selectLoginLoading, selectLoginError, selectLoginSuccess } from '../containers/Login/loginSelectors';
import { loginRequest } from '../containers/Login/loginActions';
import { LoginFormData } from '../types/loginTypes';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const success = useSelector(selectLoginSuccess);

  const handleSubmit = (formData: LoginFormData) => {
    dispatch(loginRequest(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LoginForm 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;