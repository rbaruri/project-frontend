import {
  UPLOAD_SYLLABUS_REQUEST,
  UPLOAD_SYLLABUS_SUCCESS,
  UPLOAD_SYLLABUS_FAILURE,
  UPDATE_UPLOAD_PROGRESS,
  RESET_SYLLABUS_STATE,
} from './syllabusConstants';

import {
  SyllabusResponse,
  UploadSyllabusPayload,
} from './syllabusTypes';

// Action Interfaces
interface UploadSyllabusRequestAction {
  type: typeof UPLOAD_SYLLABUS_REQUEST;
  payload: UploadSyllabusPayload;
}

interface UploadSyllabusSuccessAction {
  type: typeof UPLOAD_SYLLABUS_SUCCESS;
  payload: SyllabusResponse;
}

interface UploadSyllabusFailureAction {
  type: typeof UPLOAD_SYLLABUS_FAILURE;
  payload: string;
}

interface UpdateUploadProgressAction {
  type: typeof UPDATE_UPLOAD_PROGRESS;
  payload: number;
}

interface ResetSyllabusStateAction {
  type: typeof RESET_SYLLABUS_STATE;
}

export type SyllabusActionTypes =
  | UploadSyllabusRequestAction
  | UploadSyllabusSuccessAction
  | UploadSyllabusFailureAction
  | UpdateUploadProgressAction
  | ResetSyllabusStateAction;

// Upload Actions
export const uploadSyllabusRequest = (payload: UploadSyllabusPayload) => ({
  type: UPLOAD_SYLLABUS_REQUEST,
  payload,
});

export const uploadSyllabusSuccess = (response: SyllabusResponse) => ({
  type: UPLOAD_SYLLABUS_SUCCESS,
  payload: response,
});

export const uploadSyllabusFailure = (error: string) => ({
  type: UPLOAD_SYLLABUS_FAILURE,
  payload: error,
});

// Progress Action
export const updateUploadProgress = (progress: number) => ({
  type: UPDATE_UPLOAD_PROGRESS,
  payload: progress,
});

// Reset Action
export const resetSyllabusState = () => ({
  type: RESET_SYLLABUS_STATE,
});
