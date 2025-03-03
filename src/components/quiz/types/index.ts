export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface QuizData {
  id: string;
  moduleId: string;
  module?: {
    id: string;
    title: string;
  };
  questions: QuizQuestion[];
  timeLimit: number;
  cutoffScore: number;
  attempts: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
}

export interface QuizState {
  data: QuizData | null;
  loading: boolean;
  error: string | null;
  currentQuestion: number;
  currentQuestionIndex: number;
  timeLeft: number;
  userAnswers: Record<string, string>;
  score: number | null;
  attempts: number;
  isSubmitted: boolean;
  showResults: boolean;
  nextModule?: {
    id: string;
    title: string;
  };
}

export interface UpdateQuizStatusPayload {
  quizId: string;
  status: string;
  score?: number;
} 