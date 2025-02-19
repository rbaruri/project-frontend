import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchModulesSuccess,
  fetchModulesFailure,
} from "./moduleActions";
import { FETCH_MODULES_REQUEST, Module } from "./moduleTypes";
import { api } from "../../api/axios";

function* fetchModulesSaga() {
  try {
    const { data }: { data: Module[] } = yield call(api.get, '/modules');
    yield put(fetchModulesSuccess(data));
  } catch (error) {
    yield put(fetchModulesFailure("Failed to load modules"));
  }
}

export function* moduleSaga() {
  yield takeLatest(FETCH_MODULES_REQUEST, fetchModulesSaga);
}
