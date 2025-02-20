import { gql } from '@apollo/client';

export const CREATE_LEARNING_PATH = gql`
  mutation CreateLearningPath($courseId: uuid!, $syllabusText: String!, $generatedPath: jsonb!) {
    insert_learning_paths_one(
      object: {
        course_id: $courseId,
        syllabus_text: $syllabusText,
        generated_path: $generatedPath
      }
    ) {
      id
      course_id
      syllabus_text
      generated_path
      created_at
    }
  }
`;

export const UPDATE_LEARNING_PATH = gql`
  mutation UpdateLearningPath($id: uuid!, $generatedPath: jsonb!) {
    update_learning_paths_by_pk(
      pk_columns: { id: $id },
      _set: { generated_path: $generatedPath }
    ) {
      id
      generated_path
      updated_at
    }
  }
`;

export const DELETE_LEARNING_PATH = gql`
  mutation DeleteLearningPath($id: uuid!) {
    delete_learning_paths_by_pk(id: $id) {
      id
    }
  }
`; 