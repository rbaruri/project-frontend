import { produce } from 'immer';
import { SyllabusState } from './syllabusTypes';
import {
  UPLOAD_SYLLABUS_REQUEST,
  UPLOAD_SYLLABUS_SUCCESS,
  UPLOAD_SYLLABUS_FAILURE,
  UPDATE_UPLOAD_PROGRESS,
  RESET_SYLLABUS_STATE,
} from './syllabusConstants';

const initialState: SyllabusState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  uploadProgress: 0,
};

export const syllabusReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_SYLLABUS_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.success = false;
        draft.uploadProgress = 0;
        break;

      case UPLOAD_SYLLABUS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.success = true;
        draft.data = action.payload;
        draft.uploadProgress = 100;
        break;

      case UPLOAD_SYLLABUS_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        draft.success = false;
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
