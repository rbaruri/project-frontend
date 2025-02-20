import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardContainer from '../containers/Dashboard/Dashboard';
import Navbar from '../components/Navbar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <DashboardContainer />
    </>
  );
};

export default DashboardPage;
