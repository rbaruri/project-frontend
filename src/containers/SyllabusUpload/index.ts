import { syllabusReducer } from './syllabusReducer';
import { syllabusSaga } from './syllabusSaga';
import {
  uploadSyllabusRequest,
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
  resetSyllabusState
} from './syllabusActions';
import {
  selectSyllabusLoading,
  selectSyllabusError,
  selectSyllabusData
} from './syllabusSelectors';
import type { 
  SyllabusState, 
  SyllabusFormData, 
  SyllabusUploadResponse 
} from './types';

export {
  // Reducer
  syllabusReducer,
  
  // Saga
  syllabusSaga,
  
  // Actions
  uploadSyllabusRequest,
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
  resetSyllabusState,
  
  // Selectors
  selectSyllabusLoading,
  selectSyllabusError,
  selectSyllabusData,
};

export type {
  SyllabusState,
  SyllabusFormData,
  SyllabusUploadResponse,
};

// Utility functions
export const validateSyllabusFile = (file: File): string | null => {
  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'File size too large. Maximum size is 10MB.';
  }

  // Validate file type
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Only PDF documents are allowed.';
  }

  return null;
};

export const createSyllabusFormData = (data: SyllabusFormData): FormData => {
  const formData = new FormData();
  if (data.file) {
    formData.append('file', data.file);
  }
  formData.append('courseName', data.courseName);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  return formData;
};
