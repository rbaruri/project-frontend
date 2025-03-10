// Action Types
export const UPLOAD_SYLLABUS_REQUEST = 'UPLOAD_SYLLABUS_REQUEST';
export const UPLOAD_SYLLABUS_SUCCESS = 'UPLOAD_SYLLABUS_SUCCESS';
export const UPLOAD_SYLLABUS_FAILURE = 'UPLOAD_SYLLABUS_FAILURE';

// State Type
export interface SyllabusState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string | null;
  syllabusId: string | null;
}

// Action Interfaces
interface UploadSyllabusRequestAction {
  type: typeof UPLOAD_SYLLABUS_REQUEST;
  payload: FormData;
}

interface UploadSyllabusSuccessAction {
  type: typeof UPLOAD_SYLLABUS_SUCCESS;
  payload: { syllabusId: string; message: string };
}

interface UploadSyllabusFailureAction {
  type: typeof UPLOAD_SYLLABUS_FAILURE;
  payload: string;
}

export type SyllabusActionTypes =
  | UploadSyllabusRequestAction
  | UploadSyllabusSuccessAction
  | UploadSyllabusFailureAction;

// Action Creators
export const uploadSyllabusRequest = (formData: FormData): UploadSyllabusRequestAction => ({
  type: UPLOAD_SYLLABUS_REQUEST,
  payload: formData,
});

export const uploadSyllabusSuccess = (data: { syllabusId: string; message: string }): UploadSyllabusSuccessAction => ({
  type: UPLOAD_SYLLABUS_SUCCESS,
  payload: data,
});

export const uploadSyllabusFailure = (error: string): UploadSyllabusFailureAction => ({
  type: UPLOAD_SYLLABUS_FAILURE,
  payload: error,
});
