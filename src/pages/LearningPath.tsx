import React from "react";
import LearningPath from "../components/ui/LearningPath";

const LearningPathPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Learning Path</h1>
      <LearningPath modules={[]} overallProgress={0} onModuleClick={() => {}} />
    </div>
  );
};

export default LearningPathPage;
