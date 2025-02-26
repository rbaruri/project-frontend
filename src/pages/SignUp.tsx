import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SignUpForm from '../components/SignUpForm';
import {
  signupRequest,
  signupReset,
  selectSignupLoading,
  selectSignupError,
  selectSignupSuccess
} from '../containers/SignUp/signupIndex';
import { SignUpFormData } from '../containers/SignUp/signupTypes';

const SignUpPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loading = useSelector(selectSignupLoading);
  const error = useSelector(selectSignupError);
  const success = useSelector(selectSignupSuccess);

  useEffect(() => {
    // Reset signup state when component unmounts
    return () => {
      dispatch(signupReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/login');
    }
  }, [success, navigate]);

  const handleSignup = (formData: SignUpFormData) => {
    dispatch(signupRequest(formData));
  };

  return <SignUpForm onSubmit={handleSignup} loading={loading} error={error} />;
};

export default SignUpPage; 