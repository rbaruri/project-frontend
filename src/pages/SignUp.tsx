import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SignUpForm from '@/components/auth/SignUpForm';
import {
  signupRequest,
  signupReset,
  selectSignupLoading,
  selectSignupError,
  selectSignupSuccess
} from '@/containers/SignUp/signupIndex';
import { SignUpFormData, SignUpPageProps } from '@/types/signupTypes';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const SignUpPage: React.FC<SignUpPageProps> = () => {
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
      <div className="fixed inset-0 top-16 flex items-center justify-center bg-white">
        <SignUpForm onSubmit={handleSignup} loading={loading} error={error} />
      </div>
    </>
  );
};

export default SignUpPage; 