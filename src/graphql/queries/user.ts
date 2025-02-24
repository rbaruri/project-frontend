import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    users_by_pk(id: $userId) {
      id
      email
      first_name
      last_name
      created_at
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $userId: Int!,
    $firstName: String!,
    $lastName: String!,
    $email: String!
  ) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: {
        first_name: $firstName,
        last_name: $lastName,
        email: $email
      }
    ) {
      id
      email
      first_name
      last_name
      created_at
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword(
    $userId: Int!,
    $currentPassword: String!,
    $newPassword: String!
  ) {
    update_user_password(
      userId: $userId,
      currentPassword: $currentPassword,
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`; 