import { takeLatest, call, put } from 'redux-saga/effects';
import axios, { AxiosResponse, AxiosProgressEvent } from 'axios';
import { get } from 'lodash';
import { UPLOAD_SYLLABUS_REQUEST } from '@/containers/SyllabusUpload/syllabusConstants';
import {
  UPLOAD_SYLLABUS_REQUEST,
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
  updateUploadProgress,
} from '@/containers/SyllabusUpload/syllabusActions';
import { UploadSyllabusPayload, SyllabusResponse } from './types';

// API call function
const uploadSyllabusAPI = async (formData: FormData) => {
  try {
    const { formData } = action.payload;

    function* onUploadProgress(progressEvent: AxiosProgressEvent) {
      const percentCompleted = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      yield put(updateUploadProgress(percentCompleted));
    }

    const response: AxiosResponse<SyllabusResponse> = yield call(() => 
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/syllabus/process`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          onUploadProgress: function(progressEvent: AxiosProgressEvent) {
            const saga = onUploadProgress(progressEvent);
            saga.next();
          },
        }
      )
    );

    if (!learningPathResponse.data.learningPath) {
      throw new Error('No learning path generated');
    }

    return {
      syllabusId: learningPathResponse.data.courseId,
      message: 'Syllabus processed and learning path created successfully'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.details || 'Upload failed');
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
