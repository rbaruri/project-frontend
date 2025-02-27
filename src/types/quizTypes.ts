export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

export interface UserAnswers {
  [key: string]: string;
}

export interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswers;
  score: number;
  cutoffScore: number;
  onRetake: () => void;
  onBackToModule: () => void;
  onNextModule: () => void;
  hasNextModule: boolean;
  timeExpired?: boolean;
}

export interface AnswerStatus {
  isCorrect: boolean;
  className: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  score: number;
  isSubmitted: boolean;
  showResults: boolean;
  timeLeft: number;
  attempts: number;
}

export interface QuizData {
  quizzes_by_pk: {
    id: string;
    cutoff_score: number;
    status: string;
    score: number;
    created_at: string;
    module: {
      id: string;
      title: string;
      course_id: string;
    };
    quiz_questions: QuizQuestion[];
  };
}

export interface NextModuleData {
  modules: {
    id: string;
    title: string;
  }[];
}

export interface QuizModule {
  id: string;
  title: string;
  course_id: string;
}

export interface QuizData {
  id: string;
  cutoff_score: number;
  status: QuizStatusType;
  score: number;
  created_at: string;
  module: QuizModule;
  quiz_questions: QuizQuestion[];
}

export interface NextModule {
  id: string;
  title: string;
}

export const QuizStatus = {
  NOT_STARTED: 'not_attempted',
  IN_PROGRESS: 'not_attempted',
  COMPLETED: 'passed',
  FAILED: 'failed'
} as const;

export type QuizStatusType = typeof QuizStatus[keyof typeof QuizStatus];

export interface UpdateQuizStatusPayload {
  quizId: string;
  status: QuizStatusType;
  score: number;
}

export interface UpdateModuleStatusPayload {
  moduleId: string;
  status: 'in_progress' | 'completed';
}
