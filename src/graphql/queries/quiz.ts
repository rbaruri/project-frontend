import { gql } from '@apollo/client';

export const GET_QUIZ_WITH_QUESTIONS = gql`
  query GetQuizWithQuestions($quizId: uuid!) {
    quizzes_by_pk(id: $quizId) {
      id
      cutoff_score
      status
      score
      created_at
      module {
        id
        title
        course_id
      }
      quiz_questions {
        id
        question
        options
        correct_option
      }
    }
  }
`;

export const GET_NEXT_MODULE = gql`
  query GetNextModule($courseId: uuid!, $currentModuleId: uuid!) {
    modules(
      where: {
        course_id: { _eq: $courseId },
        id: { _gt: $currentModuleId }
      }
      order_by: { id: asc }
      limit: 1
    ) {
      id
      title
    }
  }
`; 