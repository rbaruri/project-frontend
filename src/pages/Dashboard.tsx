import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Dashboard 
      firstName={user.first_name || ''} 
      email={user.email || ''} 
      userId={user.id || ''} 
      onLogout={handleLogout} 
    />
  );
};

export default DashboardPage;
