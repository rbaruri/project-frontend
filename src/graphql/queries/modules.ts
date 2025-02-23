import { gql } from '@apollo/client';

export const GET_MODULES_BY_COURSE = gql`
  query GetModulesByCourse($courseId: uuid!) {
    modules(where: { course_id: { _eq: $courseId } }) {
      id
      course_id
      title
      status
      created_at
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
    }
  }
`; 