import { gql } from '@apollo/client';

export const UPDATE_QUIZ_STATUS = gql`
  mutation UpdateQuizStatus($quizId: uuid!, $status: String!, $score: Int!) {
    update_quizzes_by_pk(
      pk_columns: { id: $quizId },
      _set: { 
        status: $status,
        score: $score
      }
    ) {
      id
      status
      score
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