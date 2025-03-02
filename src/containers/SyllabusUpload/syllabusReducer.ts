import { produce } from 'immer';
import { SyllabusState } from '@/types/syllabusTypes';
import {
  UPLOAD_SYLLABUS_REQUEST,
  UPLOAD_SYLLABUS_SUCCESS,
  UPLOAD_SYLLABUS_FAILURE,
  SyllabusActionTypes,
} from './syllabusActions';

export interface SyllabusState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  syllabusId: string | null;
  message: string | null;
}

const initialState: SyllabusState = {
  status: 'idle',
  syllabusId: null,
  message: null,
};

export const syllabusReducer = (
  state = initialState,
  action: SyllabusActionTypes
): SyllabusState => {
  switch (action.type) {
    case UPLOAD_SYLLABUS_REQUEST:
      return {
        ...state,
        status: 'uploading',
        syllabusId: null,
        message: null,
      };
    case UPLOAD_SYLLABUS_SUCCESS:
      return {
        ...state,
        status: 'success',
        syllabusId: action.payload.syllabusId,
        message: action.payload.message,
      };
    case UPLOAD_SYLLABUS_FAILURE:
      return {
        ...state,
        status: 'error',
        message: action.payload,
      };
    default:
      return state;
  }
};
