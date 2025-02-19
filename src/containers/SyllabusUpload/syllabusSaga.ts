import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from '../../api/axios';
import {
  UPLOAD_SYLLABUS_REQUEST,
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
} from './syllabusActions';

// API call function
const uploadSyllabusAPI = async (formData: FormData) => {
  try {
    // Add userId to formData - you should get this from your auth context or redux store
    formData.append('userId', '1'); // Replace with actual user ID from your auth system
    
    const response = await api.post('/upload-syllabus', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Upload failed');
  }
};

// Worker Saga
function* handleSyllabusUpload(action: { type: string; payload: FormData }) {
  try {
    const response = yield call(uploadSyllabusAPI, action.payload);
    yield put(uploadSyllabusSuccess(response));
  } catch (error) {
    yield put(uploadSyllabusFailure(error instanceof Error ? error.message : 'Upload failed'));
  }
}

// Watcher Saga
export function* syllabusSaga() {
  yield takeLatest(UPLOAD_SYLLABUS_REQUEST, handleSyllabusUpload);
}
