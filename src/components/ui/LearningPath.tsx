import React from "react";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

const LearningPathComponent = ({ modules, overallProgress, onModuleClick }: any) => {
  return (
    <div>
      <Card>
        <ProgressBar progress={overallProgress} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module: any) => (
          <div key={module.id} onClick={() => onModuleClick(module)} className="cursor-pointer">
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
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
