export interface QuizResultsProps {
  questions: {
    id: string;
    question: string;
    options: string[];
    correct_option: string;
  }[];
  userAnswers: { [key: string]: string };
  score: number;
  cutoffScore: number;
  onRetake: () => void;
  onBackToModule: () => void;
  onNextModule: () => void;
  hasNextModule: boolean;
  timeExpired?: boolean;
  onReview: () => void;
  timeTaken: number;
  moduleId?: string;
  moduleName?: string;
  moduleReports?: any[];
  quizId: string;
} 