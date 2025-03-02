export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizProps {
  quiz: QuizQuestion[];
  currentQuestion: number;
  selectedAnswers: string[];
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

export interface OptionButtonProps {
  option: string;
  isSelected: boolean;
  onSelect: () => void;
}

export interface NavigationButtonsProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
} 