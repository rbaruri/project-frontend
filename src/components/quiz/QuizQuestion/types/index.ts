export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerSelect: (questionId: string, answer: string) => void;
} 