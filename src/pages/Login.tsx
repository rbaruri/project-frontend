import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '@/components/LoginForm';
import { selectLoginLoading, selectLoginError } from '@/containers/Login/loginSelectors';
import { loginRequest } from '@/containers/Login/loginActions';
import { LoginFormData, LoginPageProps } from '@/types/loginTypes';

const LoginPage: React.FC<LoginPageProps> = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);

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