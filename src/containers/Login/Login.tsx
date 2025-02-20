import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import LoginForm from '../../components/LoginForm';

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // In a real application, you would make an API call here
      // For demo purposes, we're creating a mock response
      const mockApiResponse = {
        user: {
          id: '1', // Mock ID
          email: formData.email,
          firstName: formData.email.split('@')[0],
          lastName: 'User',
        },
        token: 'mock-jwt-token', // In real app, this would come from your backend
      };
      
      login(mockApiResponse);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LoginForm
      formData={formData}
      error={error}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};

export default LoginContainer; 