export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correct_option: string;
  };
  questionNumber: number;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, selectedOption: string) => void;
  isReviewMode?: boolean;
  correctOption?: string;
} 