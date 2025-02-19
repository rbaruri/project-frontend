import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from '../../api/axios';
import {
  UPLOAD_SYLLABUS_REQUEST,
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
  SyllabusActionTypes
} from './syllabusActions';

// API call function
const uploadSyllabusAPI = async (formData: FormData) => {
  try {
    // First, extract text from the syllabus
    const textExtractionResponse = await api.post('/ocr/extract-text', formData);
    const { extractedText } = textExtractionResponse.data;

    // Then, generate learning path with the extracted text
    const learningPathResponse = await api.post('/api/learning-path', {
      extractedText,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!learningPathResponse.data.learningPath) {
      throw new Error('No learning path generated');
    }

    return learningPathResponse.data.learningPath;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Upload failed');
  }
};

// Worker Saga
function* handleSyllabusUpload(action: { type: string; payload: FormData }): Generator<any, void, any> {
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
