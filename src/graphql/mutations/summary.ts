import { gql } from '@apollo/client';

export const STORE_USER_SUMMARY = gql`
  mutation StoreUserSummary($userId: uuid!, $moduleId: uuid!, $summary: jsonb!) {
    insert_user_summaries_one(
      object: {
        user_id: $userId,
        module_id: $moduleId,
        summary: $summary
      },
      on_conflict: {
        constraint: user_summaries_user_id_module_id_key,
        update_columns: [summary, created_at]
      }
    ) {
      id
      user_id
      module_id
      summary
      created_at
    }
  }
`; 