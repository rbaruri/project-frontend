import { gql } from '@apollo/client';

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      name
      created_at
      start_date
      end_date
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
  query GetCoursesWithLearningPaths {
    courses {
      id
      name
      start_date
      end_date
      learning_paths {
        id
        generated_path
        created_at
      }
    }
  }
`; 