import { gql } from '@apollo/client';

export const UPDATE_PASSWORD = gql`
  mutation UpdateUserPassword($userId: Int!, $hashedPassword: String!) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: { hashed_password: $hashedPassword }
    ) {
      id
      email
      updated_at
    }
  }
`; 