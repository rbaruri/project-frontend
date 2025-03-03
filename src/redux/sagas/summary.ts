import { takeLatest, put, call } from 'redux-saga/effects';
import {
  GENERATE_MODULE_SUMMARY,
  GenerateModuleSummaryAction
} from '../types/summary';
import {
  generateModuleSummarySuccess,
  generateModuleSummaryFailure
} from '../actions/summary';
import SummaryService from '@/summary/service';

function* generateModuleSummarySaga(action: GenerateModuleSummaryAction) {
  try {
    const summaryService = SummaryService.getInstance();
    const response = yield call(
      [summaryService, summaryService.generateSummary],
      action.payload.moduleReports
    );

    if (response.error) {
      yield put(generateModuleSummaryFailure(action.payload.moduleId, response.error));
      return;
    }

    yield put(generateModuleSummarySuccess(action.payload.moduleId, response.analysis));

    // Log the analysis in the console
    console.group('Module Summary Analysis');
    console.log('Module ID:', action.payload.moduleId);
    console.log('Analysis:', response.analysis);
    console.groupEnd();
  } catch (error) {
    yield put(
      generateModuleSummaryFailure(
        action.payload.moduleId,
        error instanceof Error ? error.message : 'Failed to generate summary'
      )
    );
  }
}

export function* watchSummary() {
  yield takeLatest(GENERATE_MODULE_SUMMARY, generateModuleSummarySaga);
} 