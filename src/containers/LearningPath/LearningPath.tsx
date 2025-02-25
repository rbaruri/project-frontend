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

  if (loading) return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading learning path: {error}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!learningPath) return (
    <div className="p-4">
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No learning path found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a syllabus or enrolling in a course.</p>
      </div>
    </div>
  );

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
