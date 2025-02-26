export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
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

export interface UserAnswers {
  [questionId: string]: string;
}

// Define quiz status values to match the database check constraint
export const QuizStatus = {
  NOT_STARTED: 'not_attempted',
  IN_PROGRESS: 'not_attempted',  // We'll use not_attempted for in progress too since it's not in the constraint
  COMPLETED: 'passed',
  FAILED: 'failed'
} as const;

export type QuizStatusType = typeof QuizStatus[keyof typeof QuizStatus]; 