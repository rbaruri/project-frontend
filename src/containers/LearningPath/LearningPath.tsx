import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLearningPath, selectLearningPathLoading, selectLearningPathError } from "./learningPathSelectors";
import { fetchLearningPathRequest } from "./learningPathActions";
import LearningPathComponent from "../../components/ui/LearningPath";
import { useNavigate } from "react-router-dom";

const LearningPathContainer = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();
  const learningPath = useSelector(selectLearningPath);
  const loading = useSelector(selectLearningPathLoading);
  const error = useSelector(selectLearningPathError);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(fetchLearningPathRequest(userId));
    }
  }, [userId, dispatch]);

  const handleModuleClick = (module: any) => {
    navigate(`/module-detail/${module.id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!learningPath) return <p>No learning path found.</p>;

  return <LearningPathComponent modules={learningPath.modules} overallProgress={learningPath.progress} onModuleClick={handleModuleClick} />;
};

export default LearningPathContainer;
