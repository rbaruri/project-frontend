export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface QuizData {
  id: string;
  title: string;
  module: {
    id: string;
    course_id: string;
  };
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_option: string;
  }>;
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

export interface NextModuleData {
  modules: {
    id: string;
    course_id: string;
  }[];
} 