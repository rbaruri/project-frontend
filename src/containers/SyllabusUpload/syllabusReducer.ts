import { produce } from 'immer';
import { isNull } from 'lodash';
import {
  SYLLABUS_UPLOAD_REQUEST,
  SYLLABUS_UPLOAD_SUCCESS,
  SYLLABUS_UPLOAD_FAILURE,
  RESET_SYLLABUS_STATE,
  SyllabusState,
  SyllabusActionTypes,
  SyllabusUploadSuccessAction,
  SyllabusUploadFailureAction
} from './types';

const initialState: SyllabusState = {
  loading: false,
  error: null,
  data: null,
};

const isSyllabusUploadSuccessAction = (action: SyllabusActionTypes): action is SyllabusUploadSuccessAction =>
  action.type === SYLLABUS_UPLOAD_SUCCESS;

const isSyllabusUploadFailureAction = (action: SyllabusActionTypes): action is SyllabusUploadFailureAction =>
  action.type === SYLLABUS_UPLOAD_FAILURE;

export const syllabusReducer = (
  state = initialState,
  action: SyllabusActionTypes
): SyllabusState => {
  return produce(state, draft => {
    switch (action.type) {
      case SYLLABUS_UPLOAD_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case SYLLABUS_UPLOAD_SUCCESS:
        if (isSyllabusUploadSuccessAction(action)) {
          draft.loading = false;
          draft.data = action.payload;
          draft.error = null;
        }
        break;

      case SYLLABUS_UPLOAD_FAILURE:
        if (isSyllabusUploadFailureAction(action)) {
          draft.loading = false;
          draft.error = action.payload;
          if (!isNull(draft.data)) {
            draft.data = null;
          }
        }
        break;

      case RESET_SYLLABUS_STATE:
        return initialState;
    }
  });
};
