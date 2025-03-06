import { call, put, takeLatest } from 'redux-saga/effects';
import { GENERATE_SUMMARY } from './summaryConstants';
import {
  GenerateSummaryAction,
  generateSummarySuccess,
  generateSummaryFailure,
  UUID
} from './summaryActions';
import SummaryService from '@/summary/services';
import { StructuredAnalysis } from '@/summary/types';

function* generateSummarySaga(action: GenerateSummaryAction): Generator<any, void, any> {
  try {
    const { moduleId, moduleReports, userId } = action.payload;
    const summaryService = SummaryService.getInstance();
    
    // Generate summary using AI
    const { analysis, error } = yield call(
      [summaryService, 'generateSummary'],
      moduleReports,
      userId,
      moduleId
    );

    if (error) {
      throw new Error(error);
    }
    
    yield put(generateSummarySuccess(moduleId, analysis));
  } catch (error) {
    console.error('Error generating summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
    yield put(generateSummaryFailure(action.payload.moduleId, errorMessage));
  }
}

export function* watchSummary() {
  yield takeLatest(GENERATE_SUMMARY, generateSummarySaga);
} 