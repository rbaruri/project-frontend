import { call, put, takeLatest } from 'redux-saga/effects';
import { GENERATE_SUMMARY } from '@/containers/SummaryReport/summaryConstants';
import {
  GenerateSummaryAction,
  generateSummarySuccess,
  generateSummaryFailure} from '@/containers/SummaryReport/summaryActions';
import SummaryService from '@/containers/SummaryReport/services';
import { QuizSummaryReport, QuizAttemptSummary } from '@/components/quiz/SummaryReport/types';

function* generateSummarySaga(action: GenerateSummaryAction): Generator<any, void, any> {
  try {
    const { moduleId, moduleReports, userId } = action.payload;
    const summaryService = SummaryService.getInstance();
    
    // Generate summary using AI - preserve original data
    const { analysis, error } = yield call({
      context: summaryService,
      fn: summaryService.generateSummary
    }, moduleReports.map(report => ({
      ...report,
      moduleId: moduleId || report.moduleId,
      // Only set moduleName if it's not already set
      moduleName: report.moduleName || 'Unknown Module',
      attempts: report.attempts.map(attempt => ({
        ...attempt,
        // Preserve original values, only use defaults if undefined
        score: attempt.score ?? 0,
        timeTaken: attempt.timeTaken ?? 0,
        timestamp: attempt.timestamp || new Date().toISOString(),
        wrongAnswers: attempt.wrongAnswers || []
      })) as QuizAttemptSummary[]
    })) as QuizSummaryReport[], userId, moduleId);

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