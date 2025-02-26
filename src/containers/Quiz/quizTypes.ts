export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
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

export interface QuizState {
  loading: boolean;
  error: string | null;
  data: QuizData | null;
  nextModule: NextModule | null;
  currentQuestionIndex: number;
  userAnswers: { [questionId: string]: string };
  timeLeft: number;
  score: number;
  isSubmitted: boolean;
  showResults: boolean;
  attempts: number;
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
