import { takeLatest, call, put } from 'redux-saga/effects';
import { get, isError } from 'lodash';
import { api } from '../../api/axios';
import {
  SYLLABUS_UPLOAD_REQUEST,
  SyllabusUploadRequestAction,
  SyllabusUploadResponse
} from './types';
import { uploadSyllabusSuccess, uploadSyllabusFailure } from './syllabusActions';

function* uploadSyllabus(action: SyllabusUploadRequestAction): Generator<any, void, any> {
  try {
    const response = yield call(api.post, '/api/syllabus/process', action.payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const data: SyllabusUploadResponse = get(response, 'data');
    yield put(uploadSyllabusSuccess(data));
  } catch (error: unknown) {
    const errorMessage = isError(error)
      ? get(error, 'response.data.error', 'An error occurred during syllabus upload')
      : 'An error occurred during syllabus upload';
    yield put(uploadSyllabusFailure(errorMessage));
  }
}

export function* syllabusSaga() {
  yield takeLatest(SYLLABUS_UPLOAD_REQUEST, uploadSyllabus);
}
