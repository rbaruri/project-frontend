export interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isReviewMode?: boolean;
}

export interface ButtonClassesProps {
  isFirstQuestion: boolean;
  canSubmit: boolean;
}

export interface ButtonClasses {
  previousButton: string;
  nextButton: string;
  submitButton: string;
} 