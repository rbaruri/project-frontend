import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import LoginForm from '../../components/LoginForm';
import { api } from '../../api/axios';

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user } = response.data;
      
      if (!user) {
        throw new Error('No user data received from server');
      }

      login({ user });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LoginForm
      formData={formData}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};

export default LoginContainer; 