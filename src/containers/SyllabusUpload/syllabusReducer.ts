import { produce } from 'immer';
import { SyllabusState } from '@/containers/SyllabusUpload/types';
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
  loading: false,
  error: null,
  data: null,
  uploadProgress: 0,
};

export const syllabusReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_SYLLABUS_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.uploadProgress = 0;
        break;

      case UPLOAD_SYLLABUS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.data = action.payload;
        draft.uploadProgress = 100;
        break;

      case UPLOAD_SYLLABUS_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        draft.uploadProgress = 0;
        break;

      case UPDATE_UPLOAD_PROGRESS:
        draft.uploadProgress = action.payload;
        break;

      case RESET_SYLLABUS_STATE:
        return initialState;

      default:
        break;
    }
  });
