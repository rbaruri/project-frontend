export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface AnswerStatus {
  isCorrect: boolean;
  className: string;
}

export interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, string>;
  score: number;
  cutoffScore: number;
  onRetake: () => void;
  onBackToModule: () => void;
  onNextModule: () => void;
  hasNextModule: boolean;
  timeExpired?: boolean;
} 