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

const SignUpPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loading = useSelector(selectSignupLoading);
  const error = useSelector(selectSignupError);
  const success = useSelector(selectSignupSuccess);

  useEffect(() => {
    console.log('SignUp component mounted');
    // Reset signup state when component unmounts
    return () => {
      console.log('SignUp component unmounting, resetting state');
      dispatch(signupReset());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log('Signup state changed:', { loading, error, success });
    
    if (success) {
      console.log('Signup successful, preparing to redirect...');
      // Add a small delay to show the success state before redirecting
      const timer = setTimeout(() => {
        navigate('/authentication/login', { 
          state: { message: 'Account created successfully! Please log in.' }
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, loading, error, navigate]);

  const handleSignup = (formData: SignUpFormData) => {
    console.log('Handling signup submission:', formData);
    dispatch(signupRequest(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SignUpForm onSubmit={handleSignup} loading={loading} error={error} />
    </div>
  );
};

export default SignUpPage; 