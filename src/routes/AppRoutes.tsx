import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import SyllabusUpload from '../containers/SyllabusUpload/SyllabusUpload';
import LearningPathContainer from '../containers/LearningPath/LearningPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<SyllabusUpload />} />
      <Route path="/learning-path" element={<LearningPathContainer />} />
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  );
};

