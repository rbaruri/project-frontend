import React from "react";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface LearningPathProps {
  modules: Module[];
  overallProgress: number;
  onModuleClick: (module: Module) => void;
  courseName: string;
}

const LearningPath: React.FC<LearningPathProps> = ({ 
  modules, 
  overallProgress, 
  onModuleClick,
  courseName 
}) => {
  return (
    <div className="p-4 space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{courseName}</h1>
        <p className="text-white/80 text-lg">Your Learning Journey</p>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90">Overall Progress</span>
            <span className="text-white font-semibold">{overallProgress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="bg-white rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const gradients = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-cyan-500 to-cyan-600',
            'from-teal-500 to-teal-600'
          ];
          const gradientClass = gradients[index % gradients.length];

          return (
            <div
              key={module.id}
              onClick={() => onModuleClick(module)}
              className="transform transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${gradientClass} rounded-xl shadow-lg p-6 h-full text-white hover:shadow-xl cursor-pointer`}>
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
                    <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-white/80 mb-4 flex-grow">{module.description}</p>
                  <div className="flex items-center mt-auto">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm font-medium">Start Learning</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
