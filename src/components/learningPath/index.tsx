import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLearningPath, selectLearningPathLoading, selectLearningPathError } from '@/containers/LearningPath/learningPathSelectors';
import LearningPathComponent from '@/components/common/LearningPath';
import { LoadingState, ErrorState, EmptyState } from './components';
import { Module } from './types';

const LearningPath: React.FC = () => {
  const learningPath = useSelector(selectLearningPath);
  const loading = useSelector(selectLearningPathLoading);
  const error = useSelector(selectLearningPathError);
  const navigate = useNavigate();

  const handleModuleClick = (module: Module) => {
    navigate(`/module-detail/${module.id}`);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!learningPath) return <EmptyState />;

  return (
    <LearningPathComponent 
      modules={learningPath.modules} 
      overallProgress={learningPath.progress} 
      onModuleClick={handleModuleClick}
      courseName={learningPath.courseName || "Your Learning Path"} 
    />
  );
};

export default LearningPath; 