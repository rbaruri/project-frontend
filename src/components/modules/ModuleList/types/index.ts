import { QuizSummaryReport } from '@/summary/types';

export enum QuizStatus {
  NOT_STARTED = 'not_started',
  NOT_ATTEMPTED = 'not_attempted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PASSED = 'passed',
  FAILED = 'failed'
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  cutoff_score: number;
  status: string;
  created_at: string;
}

export interface SimilarQuestion {
  id: string;
  module_id: string;
  question: string;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  status: string;
  created_at: string;
  resources: Resource[];
  quizzes: Quiz[];
  similar_questions: SimilarQuestion[];
  quiz_reports?: QuizSummaryReport[];
}

export interface ModuleListProps {
  courseId: string;
}

export interface ProgressData {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export enum ModuleStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
} 