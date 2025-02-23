import { gql } from '@apollo/client';

export const GET_ALL_COURSES = gql`
  query GetAllCourses($userId: Int!) {
    courses(where: { user_id: { _eq: $userId }}) {
      id
      name
      created_at
      start_date
      end_date
      user_id
    }
  }
`;

export const GET_COURSE_WITH_LEARNING_PATH = gql`
  query GetCourseWithLearningPath($id: uuid!) {
    courses_by_pk(id: $id) {
      id
      name
      start_date
      end_date
      user_id
      learning_paths {
        id
        syllabus_text
        generated_path
        created_at
      }
    }
  }
`;

export const GET_COURSES_WITH_LEARNING_PATHS = gql`
  query GetCoursesWithLearningPaths($userId: Int!) {
    courses(where: { user_id: { _eq: $userId }}) {
      id
      name
      start_date
      end_date
      user_id
      learning_paths {
        id
        generated_path
        created_at
      }
      modules {
        id
        title
        status
      }
    }
  }
`;

export const UPDATE_COURSE_NAME = gql`
  mutation UpdateCourseName($id: uuid!, $name: String!) {
    update_courses_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name }
    ) {
      id
      name
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