import { gql } from '@apollo/client';

// Define module status values
export const ModuleStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

export type ModuleStatusType = typeof ModuleStatus[keyof typeof ModuleStatus];

export const GET_MODULES_BY_COURSE = gql`
  query GetModulesByCourse($courseId: uuid!) {
    modules(
      where: { course_id: { _eq: $courseId } }
      order_by: { created_at: asc }
    ) {
      id
      title
      status
      created_at
      start_date
      end_date
      hours_allocated
      resources {
        id
        title
        url
        created_at
      }
      quizzes {
        id
        status
        cutoff_score
        score
        created_at
      }
      similar_questions {
        id
        question
        created_at
      }
    }
  }
`;

export const GET_ALL_MODULES = gql`
  query GetAllModules {
    modules {
      id
      course_id
      title
      status
      created_at
      resources {
        id
        title
        url
        created_at
      }
      quizzes {
        id
        cutoff_score
        status
        created_at
      }
      similar_questions {
        id
        question
        created_at
      }
    }
  }
`;

export const UPDATE_MODULE_STATUS = gql`
  mutation UpdateModuleStatus($moduleId: uuid!, $status: String!) {
    update_modules_by_pk(
      pk_columns: { id: $moduleId },
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;

// Add interfaces for type safety
export interface Resource {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  status: string;
  cutoff_score: number;
  score: number;
}

export interface SimilarQuestion {
  id: string;
  question: string;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  status: ModuleStatusType;
  created_at: string;
  start_date: string;
  end_date: string;
  hours_allocated: number;
  resources: Resource[];
  quizzes: Quiz[];
  similar_questions: SimilarQuestion[];
} 