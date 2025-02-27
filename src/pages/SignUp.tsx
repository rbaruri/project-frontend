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
import { SignUpFormData } from '../types/signupTypes';
import LoadingOverlay from '../components/ui/LoadingOverlay';

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
      const timer = setTimeout(() => {
        navigate('/authentication/login', { 
          state: { message: 'Account created successfully! Please log in.' }
        });
      }, 800); // Smooth 800ms transition

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSignup = (formData: SignUpFormData) => {
    dispatch(signupRequest(formData));
  };

  return (
    <>
      {(loading || success) && <LoadingOverlay />}
      <div className="min-h-screen bg-gray-50">
        <SignUpForm onSubmit={handleSignup} loading={loading} error={error} />
      </div>
    </>
  );
};

export default SignUpPage; 