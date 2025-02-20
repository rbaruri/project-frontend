import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const DashboardContainer: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Prevent rendering if user is not available

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <Dashboard firstName={user.firstName} email={user.email} onLogout={handleLogout} />;
};

export default DashboardContainer;
