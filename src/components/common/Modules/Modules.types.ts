export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  hoursRequired: string;
  startDate: string;
  endDate: string;
  status: string;
  resources?: {
    sources: Array<{ name: string; url: string }>;
    similarQuestions: string[];
  };
  quiz?: QuizQuestion[];
}

export interface ModuleProps {
  module: Module;
  showQuiz: boolean;
  hasQuiz: boolean;
  onQuizToggle: () => void;
} 