import { gql } from '@apollo/client';

export const GET_USER_MODULE_DATA = gql`
  query GetUserModuleData($moduleId: uuid!) {
    modules_by_pk(id: $moduleId) {
      id
      title
      course {
        user_id
      }
    }
  }
`;

export const GET_USER_SUMMARIES = gql`
  query GetUserSummaries($userId: uuid!, $moduleId: uuid!) {
    user_summaries(
      where: {
        user_id: { _eq: $userId },
        module_id: { _eq: $moduleId }
      }
    ) {
      id
      user_id
      module_id
      analysis
      created_at
    }
  }
`; 