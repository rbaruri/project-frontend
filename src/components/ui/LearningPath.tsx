import React from "react";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface LearningPathProps {
  modules: Module[];
  overallProgress: number;
  onModuleClick: (module: Module) => void;
}

const LearningPathComponent: React.FC<LearningPathProps> = ({ 
  modules, 
  overallProgress, 
  onModuleClick 
}) => {
  return (
    <div className="p-4">
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
        <ProgressBar progress={overallProgress} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} onClick={() => onModuleClick(module)}>
            <Card className="h-full p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{module.description}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathComponent;
