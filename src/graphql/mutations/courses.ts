import { gql } from '@apollo/client';

export const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $startDate: date!, $endDate: date!) {
    insert_courses_one(
      object: {
        name: $name,
        start_date: $startDate,
        end_date: $endDate
      }
    ) {
      id
      name
      start_date
      end_date
      created_at
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: uuid!, $name: String, $startDate: date, $endDate: date) {
    update_courses_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        start_date: $startDate,
        end_date: $endDate
      }
    ) {
      id
      name
      start_date
      end_date
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: uuid!) {
    delete_courses_by_pk(id: $id) {
      id
    }
  }
`; 