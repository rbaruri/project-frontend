export interface Module {
  id: string;
  title: string;
  description: string;
}

export interface LearningPathProps {
  modules: Module[];
  overallProgress: number;
  onModuleClick: (module: Module) => void;
  courseName: string;
} 