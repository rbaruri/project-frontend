// Action Types
export const UPLOAD_SYLLABUS_REQUEST = "UPLOAD_SYLLABUS_REQUEST";
export const UPLOAD_SYLLABUS_SUCCESS = "UPLOAD_SYLLABUS_SUCCESS";
export const UPLOAD_SYLLABUS_FAILURE = "UPLOAD_SYLLABUS_FAILURE";

// Action Interfaces
interface UploadSyllabusRequestAction {
  type: typeof UPLOAD_SYLLABUS_REQUEST;
  payload: { file: File; startDate: string; endDate: string };
}

interface UploadSyllabusSuccessAction {
  type: typeof UPLOAD_SYLLABUS_SUCCESS;
  payload: string;
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
export const uploadSyllabusRequest = (
  file: File,
  startDate: string,
  endDate: string
): UploadSyllabusRequestAction => ({
  type: UPLOAD_SYLLABUS_REQUEST,
  payload: { file, startDate, endDate },
});

export const uploadSyllabusSuccess = (message: string): UploadSyllabusSuccessAction => ({
  type: UPLOAD_SYLLABUS_SUCCESS,
  payload: message,
});

export const uploadSyllabusFailure = (error: string): UploadSyllabusFailureAction => ({
  type: UPLOAD_SYLLABUS_FAILURE,
  payload: error,
});
