export interface SyllabusFormData {
  courseName: string;
  startDate: string;
  endDate: string;
  file: File | null;
}

export interface SyllabusUploadResponse {
  id: string;
  courseName: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
  createdAt: string;
}

export interface SyllabusState {
  loading: boolean;
  error: string | null;
  data: SyllabusUploadResponse | null;
}

// Action Types
export const SYLLABUS_UPLOAD_REQUEST = 'app/SyllabusUpload/UPLOAD_REQUEST' as const;
export const SYLLABUS_UPLOAD_SUCCESS = 'app/SyllabusUpload/UPLOAD_SUCCESS' as const;
export const SYLLABUS_UPLOAD_FAILURE = 'app/SyllabusUpload/UPLOAD_FAILURE' as const;
export const RESET_SYLLABUS_STATE = 'app/SyllabusUpload/RESET_STATE' as const;

export interface SyllabusUploadRequestAction {
  type: typeof SYLLABUS_UPLOAD_REQUEST;
  payload: FormData;
  [key: string]: any;
}

export interface SyllabusUploadSuccessAction {
  type: typeof SYLLABUS_UPLOAD_SUCCESS;
  payload: SyllabusUploadResponse;
  [key: string]: any;
}

export interface SyllabusUploadFailureAction {
  type: typeof SYLLABUS_UPLOAD_FAILURE;
  payload: string;
  [key: string]: any;
}

export interface ResetSyllabusStateAction {
  type: typeof RESET_SYLLABUS_STATE;
  [key: string]: any;
}

export type SyllabusActionTypes =
  | SyllabusUploadRequestAction
  | SyllabusUploadSuccessAction
  | SyllabusUploadFailureAction
  | ResetSyllabusStateAction; 