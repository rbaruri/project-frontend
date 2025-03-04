import { takeLatest, put, call } from 'redux-saga/effects';
import { GENERATE_SUMMARY } from './summaryConstants';
import { GenerateSummaryAction } from './summaryActions';
import {
  generateSummarySuccess,
  generateSummaryFailure
} from './summaryActions';
import SummaryService from '@/summary/service';

function* generateSummarySaga(action: GenerateSummaryAction) {
  try {
    const summaryService = SummaryService.getInstance();
    const response = yield call(
      [summaryService, summaryService.generateSummary],
      action.payload.moduleReports
    );

    if (response.error) {
      yield put(generateSummaryFailure(action.payload.moduleId, response.error));
      return;
    }

    yield put(generateSummarySuccess(action.payload.moduleId, response.analysis));

    // Log the analysis in the console
    console.group('Summary Analysis');
    console.log('Module ID:', action.payload.moduleId);
    console.log('Analysis:', response.analysis);
    console.groupEnd();
  } catch (error) {
    yield put(
      generateSummaryFailure(
        action.payload.moduleId,
        error instanceof Error ? error.message : 'Failed to generate summary'
      )
    );
  }
}

export function* watchSummary() {
  yield takeLatest(GENERATE_SUMMARY, generateSummarySaga);
} 