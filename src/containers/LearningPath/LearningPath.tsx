import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLearningPath, selectLearningPathLoading, selectLearningPathError } from "./learningPathSelectors";
import LearningPathComponent from "../../components/ui/LearningPath";
import { useNavigate } from "react-router-dom";

const LearningPath = () => {
  const learningPath = useSelector(selectLearningPath);
  const loading = useSelector(selectLearningPathLoading);
  const error = useSelector(selectLearningPathError);
  const navigate = useNavigate();

  const handleModuleClick = (module: any) => {
    navigate(`/module-detail/${module.id}`);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!learningPath) return <div className="p-4">No learning path found.</div>;

  return (
    <LearningPathComponent 
      modules={learningPath.modules} 
      overallProgress={learningPath.progress} 
      onModuleClick={handleModuleClick} 
    />
  );
};

export default LearningPath;
