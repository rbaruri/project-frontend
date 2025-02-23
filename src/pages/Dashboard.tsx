import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardContainer from '../containers/Dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" />;

  return <DashboardContainer />;
};

export default DashboardPage;
