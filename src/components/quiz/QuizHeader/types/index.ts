export interface QuizHeaderProps {
  moduleTitle: string;
  timeLeft: number;
  cutoffScore: number;
  currentQuestion: number;
  totalQuestions: number;
  attempts: number;
  isSubmitted: boolean;
  score: number;
  progress: number;
} 