import { takeLatest, call, put } from 'redux-saga/effects';
import axios, { AxiosResponse, AxiosProgressEvent } from 'axios';
import { get } from 'lodash';
import { UPLOAD_SYLLABUS_REQUEST } from './syllabusConstants';
import {
  uploadSyllabusSuccess,
  uploadSyllabusFailure,
  updateUploadProgress,
} from './syllabusActions';
import { UploadSyllabusPayload, SyllabusResponse } from '../../types/syllabusTypes';

export function* uploadSyllabusSaga(action: { type: string; payload: UploadSyllabusPayload }): Generator<any, void, AxiosResponse<SyllabusResponse>> {
  try {
    const { formData, courseId } = action.payload;

    const response: AxiosResponse<SyllabusResponse> = yield call(() => 
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/syllabus/upload/${courseId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            put(updateUploadProgress(percentCompleted));
          },
        }
      )
    );

    yield put(uploadSyllabusSuccess(response.data));
  } catch (error: any) {
    const errorMessage = get(error, 'response.data.message', 'Failed to upload syllabus');
    yield put(uploadSyllabusFailure(errorMessage));
  }
}

export function* watchSyllabusSaga(): Generator {
  yield takeLatest(UPLOAD_SYLLABUS_REQUEST, uploadSyllabusSaga);
}
